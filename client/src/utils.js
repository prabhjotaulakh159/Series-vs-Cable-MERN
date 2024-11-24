const types = ['cable', 'streaming'];

/**
 * This fetches the highest rated show of the cable and streaming
 * companies that have the highest average scores
 * @param {Array} companies - the companies from which to filter
 * @param {Array} series - All series in the db to filter to find the highest score
 * @returns - A map with the winning cable and streaming series objects
 */
async function fetchHighestRatedShowAmongCompanies(companies, series) {
  const highestScoreCable = companies.filter(company => 
    company.type === 'cable'
  ).reduce((accumulator, currentValue) => {
    if (accumulator.averageScore > currentValue.averageScore) {
      return accumulator;
    }
    return currentValue;
  }, {averageScore: 0});
  const highestScoreStreaming = companies.filter(company => 
    company.type === 'streaming'
  ).reduce((accumulator, currentValue) => {
    if (accumulator.averageScore > currentValue.averageScore) {
      return accumulator;
    }
    return currentValue;
  }, {averageScore: 0});

  const winningCableSeries = series.filter(show => 
    show.companyId === highestScoreCable.id
  ).reduce((accumulator, currentValue) => {
    if (accumulator.score > currentValue.score) {
      return accumulator;
    }
    return currentValue;
  }, {score: 0});

  const winningStreamingSeries = series.filter(show => 
    show.companyId === highestScoreStreaming.id
  ).reduce((accumulator, currentValue) => {
    if (accumulator.score > currentValue.score) {
      return accumulator;
    }
    return currentValue;
  }, {score: 0});

  return {cable: winningCableSeries, streaming: winningStreamingSeries};
}

/**
 * This fetches the longest show of the cable and streaming
 * companies
 * @param {Array} companies - unused, but needed to keep convention
 * @param {Array} series - All series in the db to filter to find the longest one
 * @returns - A map with the winning cable and streaming series objects
 */
async function fetchLongestShowForTypes(companies, series) {
  const longestStreamingShow = series.filter(show => 
    show.companyType === 'streaming'
  ).reduce((accumulator, currentValue) => {
    if (accumulator.numberOfSeasons > currentValue.numberOfSeasons) {
      return accumulator;
    }
    return currentValue;
  }, {numberOfSeasons: 0});

  const longestCableShow = series.filter(show => 
    show.companyType === 'cable'
  ).reduce((accumulator, currentValue) => {
    if (accumulator.numberOfSeasons > currentValue.numberOfSeasons) {
      return accumulator;
    }
    return currentValue;
  }, {numberOfSeasons: 0});

  return {cable: longestCableShow, streaming: longestStreamingShow};
}

/**
 * This fetches the highest rated show of the cable and streaming overall
 * @param {Array} companies - unused, but needed to keep convention
 * @param {Array} series - All series in the db to filter to find the highest score
 * @returns - A map with the winning cable and streaming series objects
 */
async function fetchHighestRatedShowsOverall(companies, series) {
  const winningCableSeries = series.filter(show => 
    show.companyType === 'cable'
  ).reduce((accumulator, currentValue) => {
    if (accumulator.score > currentValue.score) {
      return accumulator;
    }
    return currentValue;
  }, {score: 0});

  const winningStreamingSeries = series.filter(show => 
    show.companyType === 'streaming'
  ).reduce((accumulator, currentValue) => {
    if (accumulator.score > currentValue.score) {
      return accumulator;
    }
    return currentValue;
  }, {score: 0});

  return {cable: winningCableSeries, streaming: winningStreamingSeries};
}


/**
 * Retrieves the top 10 companies that have the highest average scores
 * @param {Array} companies - companies from which to filter
 * @returns - dataset object which will be passed to our graph component
 */
async function getTopContendingCompanies(companies) {
  const topCompanies = Array.from(
    new Set(companies.sort((a, b) => b.averageScore - a.averageScore))
  ).slice(0, 10);

  const data = types.map(type => {
    const xAxis = topCompanies.filter(company => 
      company.type === type
    ).map(company => company.name);
    const yAxis = topCompanies.filter(company => 
      company.type === type
    ).map(company => company.averageScore);

    return {
      'name': type,
      'x': xAxis,
      'y': yAxis,
      'type': 'bar'
    };
    
  });

  return data;
}

/**
 * Calculates the average number of seasons per year for streaming and cable
 * @param { Array } series - Series to calculate average # of seasons/year
 * @return Data for the graph
 */
async function calcAvgNumSeasonsPerYear(series) {
  const cableShows = getSeriesByCompanyType(series, 'cable');
  const streamingShows = getSeriesByCompanyType(series, 'streaming');

  const mapYearToNumberOfSeasonsForCable = 
    calculateTotalNumberSeasonsPerYear(cableShows);
  const mapYearToNumberOfSeasonsForStreaming = 
    calculateTotalNumberSeasonsPerYear(streamingShows);

  const mapAvgNumSeasonsToYearForCable = 
    calculateAverageNumberOfSeaonsPerYear(mapYearToNumberOfSeasonsForCable);
  const mapAvgNumSeaonsToYearForStreaming = 
    calculateAverageNumberOfSeaonsPerYear(mapYearToNumberOfSeasonsForStreaming);

  const yearsForCable = Array.from(mapAvgNumSeasonsToYearForCable.keys());
  const yearsForStreaming = Array.from(mapAvgNumSeaonsToYearForStreaming.keys());
  
  const avgSeasonsForCable = Array.from(mapAvgNumSeasonsToYearForCable.values());
  const avgSeasonsForStreaming = Array.from(mapAvgNumSeaonsToYearForStreaming.values());

  return [
    {
      x: yearsForCable,
      y: avgSeasonsForCable,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Cable',
      marker: { color: 'blue', size: 6, symbol: 'circle' },
    },
    {
      x: yearsForStreaming,
      y: avgSeasonsForStreaming,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Streaming',
      marker: { color: 'orange', size: 6, symbol: 'circle' },
    }
  ];
}

/**
 * Get all the series based on company type and not in the year 2025
 * @param { Array } series - Series to filter by type
 * @param { String } type - Type of company to filter by
 * @return Filtered companies
 */
function getSeriesByCompanyType(series, type) {
  return series.
    filter(show => show.companyType === type && show.year !== 2025).
    sort((a, b) => a.year - b.year);
}

/**
 * Calculates the total number of seasons per year for given shows 
 * (cable or streaming)
 * @param { Array} shows - Series to calculate number of seasons per year
 * @return Map of year to # of seasons
 */
function calculateTotalNumberSeasonsPerYear(shows) {
  const map = new Map();
  shows.forEach(show => {
    const year = show.year;
    const numberOfSeasons = show.numberOfSeasons;
    if (map.has(year) === false) {
      map.set(year, { totalNumberOfSeasons: 0, numberOfShows: 0 });
    }
    const data = map.get(year);
    data.totalNumberOfSeasons += numberOfSeasons;
    data.numberOfShows = data.numberOfShows + 1;
  });
  return map;
}

/**
 * Calculates the average number of seasons per year for a given map 
 * of years to total # of seasons
 * @param { Map } mapYearToNumberOfSeasons - Map of year -> # of seasons
 * @return Another map of years -> avg # of seasons
 */
function calculateAverageNumberOfSeaonsPerYear(mapYearToNumberOfSeasons) {
  const map = new Map();
  Array.from(mapYearToNumberOfSeasons.keys()).forEach(year => {
    const totalSeasonsForThatYear = mapYearToNumberOfSeasons.get(year).totalNumberOfSeasons;
    const totalNumberOfShowsForThatYear = mapYearToNumberOfSeasons.get(year).numberOfShows;
    map.set(year, totalSeasonsForThatYear / totalNumberOfShowsForThatYear);
  });
  return map;
}

/**
 * This function is used in the line chart for the average scores per year
 * of cable versus streaming services.
 * Because each line chart needs an x axis and a y axis, this function returns
 * an array with 2 {xAxis, yAxis} objects 
 * 
 * @param {Array} series - list of all series 
 * @returns  - an array with 2 objects representing the x axis and y axis plots
 */
async function calculateCompanyScoresPerYear(series){

  const xAxis = Array.from(new Set(series.map(show => show.year).
    filter(year => year))).
    sort((a, b) => a - b).
    filter( year => year < 2025);

  const cableSeries = series.filter( show => 
    show.companyType === 'cable' && Number(show.year) < 2025);

  const streamingSeries = series.filter( show =>
    show.companyType === 'streaming' && Number(show.year) < 2025);

  const cableSeriesByYear = Object.groupBy(cableSeries, ({year}) => year  );
  const streamingSeriesByYear = Object.groupBy(streamingSeries, ({year}) => year);


  const cableAverageScores = [];

  Object.keys(cableSeriesByYear).forEach(year => {
    let totalScoreForYear = 0;
    cableSeriesByYear[year].forEach(show => {
      totalScoreForYear += show.score;
    });
    const averageScore = totalScoreForYear / cableSeriesByYear[year].length;
    cableAverageScores.push(averageScore * 100);
  });

  const streamingAverageScores = [];

  Object.keys(streamingSeriesByYear).forEach(year => {
    let totalScoreForYear = 0;
    streamingSeriesByYear[year].forEach(show => {
      totalScoreForYear += show.score;
    });
    const averageScore = totalScoreForYear / cableSeriesByYear[year].length;
    streamingAverageScores.push(averageScore * 100);
  });

  const data = [
    {
      x: xAxis,
      y: cableAverageScores,
      type: 'scatter',
      mode: 'lines+markers',
      marker: {color: 'red'},
      name: 'cable'
    },
    {
      x: xAxis,
      y: streamingAverageScores,
      type: 'scatter',
      mode: 'lines+markers',
      marker: {color: 'blue'},
      name: 'streaming'
    }
    
  ];
    
  return data;
  
}

export {
  getTopContendingCompanies, 
  calcAvgNumSeasonsPerYear, 
  calculateCompanyScoresPerYear,
  fetchHighestRatedShowsOverall as fetchCompaniesWithHighestScores,
  fetchHighestRatedShowAmongCompanies,
  fetchLongestShowForTypes
};