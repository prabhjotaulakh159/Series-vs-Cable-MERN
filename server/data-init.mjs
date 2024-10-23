import API_KEY from './api.key.mjs';
import {TOKEN} from './bin/www';

const MIN_AIR_DATE = new Date('1990-01-01');
const countries = ['can', 'usa', 'gbr'];

/**
 * This function retrieves the token needed to authorize fetches to the TV DB
 * @returns {string} - represents the token valid for the whole session
 */
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

/**
 * This function fetches all series (and their extended endpoints)
 * and filters this information to include the needed JSON for our app.
 * 
 * A valid series falls within the following:
 * - its country is either Great Britain, Canada, or USA (see countries list for codes)
 * - its company is either a cable or streaming service
 * - its release date is from 1990-01-01 and onwards 
 * 
 * @returns {JSON} - represents the filtered series
 */
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
      'year': Number(show.firstAired.split('-')[0])
    };
  });

  return filteredSeries;
}

/**
 * This function retireves the list of a show's genres
 * 
 * @param {JSON} show - the show to check
 * @returns {Array} -  represents all genres of a TV show
 */
function getGenres(show) {
  return show.genres.map(genre => genre.name);
}

/**
 * This calculates a given show's total seasons.
 * 
 * @param {JSON} show - the show to check
 * @returns {Number} - the number of seasons of a show
 */
function getNumberOfSeasons(show) {
  const seasons = show.seasons.filter(season => season.type.name === 'Aired Order');

  return seasons.length;
}

/**
 * This function will check to see if the show is either on a cable or streaming service company
 *  
 * @param {JSON} show - the show to check
 * @returns {Boolean} - represents whether the show is either a cable or streaming service show
 */
function isCableOrStreaming(show) {
  const originalNetwork = show.originalNetwork ? show.originalNetwork.tagOptions : undefined;
  return originalNetwork && 
  (originalNetwork[0].name.toLowerCase().includes('cable') 
  || originalNetwork[0].name.toLowerCase().includes('svod'));
}

export {fetchToken, fetchAllSeries};