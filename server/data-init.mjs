/* eslint-disable max-len */
import API_KEY from './api.key.mjs';
import pLimit from 'p-limit';

const MIN_AIR_DATE = new Date('2010-01-01');
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
 * Retrieves all the companies from the TB DB based on the series given. 
 * It will filter the companies to only include the fields we need and create a
 * new list of company objects.
 * 
 * @param {Array} series - represents the series whose companies we want to fetch
 * @param {String} token - represents token needed to authorize fetch
 * @returns 
 */
async function fetchAllCompanies(series, token) {
  const companyIdsSet = new Set(series.map(show => show.companyId));
  const companyIds = [...companyIdsSet];
  const response = await Promise.all(companyIds.map(companyId => 
    fetch(`https://api4.thetvdb.com/v4/companies/${Number(companyId)}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
  ));

  const json = await Promise.all(response.map(response => 
    response.json()
  ));

  const companies = json.map(company => company.data);

  const companyScoresAndTypes = getCompanyScoresAndTypes(companyIds, series);


  const filteredCompanies = companies.map(company => {
    return {
      'id': company.id,
      'name': company.name,
      'averageScore': companyScoresAndTypes.get(company.id).averageScore,
      'type': companyScoresAndTypes.get(company.id).type
    };
  });

  return filteredCompanies;
}

function getCompanyScoresAndTypes(companyIds, series) {
  const companyMap = new Map();
  companyIds.forEach(id => {
    companyMap.set(id, {
      'averageScore': calculateCompanyScore(id, series),
      'type': getCompanyType(id, series)
    });
  });
  return companyMap;
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
  for (const show of series) {
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
 * P-limit: https://doziestar.medium.com/serving-tasks-efficiently-understanding-p-limit-in-javascript-fb524a35b846
 * 
 * @returns {JSON} - represents the filtered series
 */
async function fetchAllSeries(token) {
  const requests = [...Array(319).keys()].map(page => 
    fetch(`https://api4.thetvdb.com/v4/series?page=${page}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
  );

  const responses = await Promise.all(requests);

  const json = await Promise.all(responses.map(response => 
    response.json()
  ));
  let series = json.flatMap(page => page.data);

  series = series.filter(show => { 
    const airDate = new Date(show.firstAired);
    return countries.includes(show.originalCountry) && 
    airDate >= MIN_AIR_DATE;
  });

  const limit = pLimit(50);

  const extendedRequests = series.map(show => 
    limit(() => 
      fetch(`https://api4.thetvdb.com/v4/series/${show.id}/extended?short=true`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }).then(response => response.json())
    )
  );

  const extendedSeries = await Promise.all(extendedRequests);

  const filteredSeries = extendedSeries.map(series => series.data).filter(show => 
    isCableOrStreaming(show)
  ).map(show => {
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