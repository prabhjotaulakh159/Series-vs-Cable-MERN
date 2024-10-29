import API_KEY from './api.key.mjs';

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

async function fetchAllCompanies(series, token) {
  const companyIds = new Set(series.map(show => show.companyId));

  const response = await Promise.all(companyIds.map(companyId => 
    fetch(`https://api4.thetvdb.com/v4/companies/${companyId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
  ));

  if (!response.ok) {
    throw new Error(`Not 2xx response, ${response.status}`, 
      {cause: response});
  }

  const json = await response.json();
  const companies = json.data;

  const companyScoresAndTypes = getCompanyScoresAndTypes(companyIds, series);

  companies.map(company => {
    return {
      'id': company.id,
      'name': company.name,
      'averageScore': companyScoresAndTypes.get(company.id).averageScore,
      'type': companyScoresAndTypes.get(company.id).averageScore
    };
  });
}

function getCompanyScoresAndTypes(companyIds, series) {
  const companyMap = new Map();
  companyIds.forEach(id => {
    companyMap.set(id, {
      'averageScore': calculateCompanyScore(id, series),
      'type': getCompanyType(id, series)
    });
  });
}

function calculateCompanyScore(id, series) {
  const scores = [];
  series.filter(show => show.companyId === id).forEach(show => {
    scores.push(show.score);
  });

  const sum = scores.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );

  return sum / scores.length;
}

function getCompanyType(id, series) {
  for (const show in series) {
    if (show.companyId === id) {
      return show.companyType;
    }
  }
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
async function fetchAllSeries(token) {
  const response = await fetch('https://api4.thetvdb.com/v4/series', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
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
        'Authorization': `Bearer ${token}`
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
      'companyId': show.originalNetwork.parentCompany.id || show.originalNetwork.id,
      'companyType': getShowCompanyType(show),
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

/**
 * 
 * @param {JSON} show - the show to check
 * @returns {string} - represents the company type of the show
 */
function getShowCompanyType(show) {
  const originalNetwork = show.originalNetwork ? show.originalNetwork.tagOptions : undefined; 
  return originalNetwork[0].name.toLowerCase().includes('cable') ? 'cable' : 'streaming';
}

export {fetchToken, fetchAllSeries, fetchAllCompanies};