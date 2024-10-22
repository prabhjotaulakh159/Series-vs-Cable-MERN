import API_KEY from './api.key.mjs';
import {TOKEN} from './bin/www';

const MIN_AIR_DATE = new Date('1990-01-01');

async function fetchToken() {
  const response = await fetch('https://api4.thetvdb.com/v4/login', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ 'apikey': API_KEY, 'pin': '' })
  });

  if (!response.ok) {
    throw new Error(`Not 2xx response, ${response.status}`, 
      {cause: response});
  }

  const json = await response.json();

  return json.data.token;
}

const countries = ['can', 'usa', 'gbr'];

async function fetchAllSeries() {
  const response = await fetch('https://api4.thetvdb.com/v4/series', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`
    }
  });

  if (!response.ok) {
    throw new Error(`Not 2xx response, ${response.status}`, 
      {cause: response});
  }

  const json = await response.json();
  const series = json.data;

  series.filter(show => { 
    const airDate = new Date(show.firstAired);
    return countries.includes(show.originalCountry) && 
    airDate >= MIN_AIR_DATE;
  });

  const extendedSeriesResponses = await Promise.all(
    series.map(show => fetch(`https://api4.thetvdb.com/v4/series/${show.id}/extended?short=true`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      }
    }))
  );

  const extendedSeries = await Promise.all(extendedSeriesResponses.map(response => 
    response.json()
  ));

  const filteredSeries = extendedSeries.map(series => series.data).filter(show => {
    return isCableOrStreaming(show);
  }).map(show => {
    return {
      'id': show.id,
      'name': show.name,
      'score': show.score,
      'numberOfSeasons': getNumberOfSeasons(show),
      'genres': getGenres(show),
      'company': show.originalNetwork.parentCompany.name || show.originalNetwork.name,
      'artwork': show.image,
      'year': show.firstAired.split('-')[0]
    };
  });

  return filteredSeries;
}

function getGenres(show) {
  return show.genres.map(genre => genre.name);
}

function getNumberOfSeasons(show) {
  const seasons = show.seasons.filter(season => season.type.name === 'Aired Order');

  return seasons.length;
}

function isCableOrStreaming(show) {
  const originalNetwork = show.originalNetwork ? show.originalNetwork.tagOptions : undefined;
  return originalNetwork && 
  (originalNetwork[0].name.toLowerCase().includes('cable') 
  || originalNetwork[0].name.toLowerCase().includes('svod'));
}

export {fetchToken, fetchAllSeries};