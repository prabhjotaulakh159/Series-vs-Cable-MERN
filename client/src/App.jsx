import './App.css';
import Graph from './graphs/Graph.jsx';
import FloatingLogos from './floating-logos/FloatingLogos.jsx';
import 'react-loading-skeleton/dist/skeleton.css';
import NavBar from './navigation/NavBar';
import { useState, useEffect, useCallback } from 'react';

const types = ['cable', 'streaming'];

function getTopContendingCompanies(companies) {
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
 * This function is a dumby function for now. in the future,
 * each graph will have its own way of customly calculating the series.
 * The catch: The functions for calculating the x and y axis MUST ALWAYS
 * RETURN AN OBJECT {xAxis, yAxis}!!! This naming convention IS IMPORTANT!!!
 * 
 * @param {Array} series - list of all series 
 * @returns - an object representing the x axis and y axis plots
 */
/* eslint-disable-next-line no-unused-vars */
function calculateAllAxies(series) {
  const onlyYears = series.map(show => show.year).filter(year => year);
  const uniqueYears = Array.from(new Set(onlyYears));
  const xAxis = uniqueYears.sort((a, b) => a - b);
  const yAxis = xAxis.map(year => {
    const showsForThatYear = series.filter(show => show.year === year).length;
    return showsForThatYear;
  });

  return {xAxis, yAxis};
}

function calcAvgNumSeasonsPerYear(series) {
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

function getSeriesByCompanyType(series, type) {
  return series.
    filter(show => show.companyType === type).
    sort((a, b) => a.year - b.year);
}

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

function calculateAverageNumberOfSeaonsPerYear(mapYearToNumberOfSeasons) {
  const map = new Map();
  Array.from(mapYearToNumberOfSeasons.keys()).forEach(year => {
    const totalSeasonsForThatYear = mapYearToNumberOfSeasons.get(year).totalNumberOfSeasons;
    const totalNumberOfShowsForThatYear = mapYearToNumberOfSeasons.get(year).numberOfShows;
    map.set(year, totalSeasonsForThatYear / totalNumberOfShowsForThatYear);
  });
  return map;
}

function App() {
  const [series, setSeries] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateAxies = useCallback((data, calculateAxiesFunction) => {
    return calculateAxiesFunction(data);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try { 
        const response = await fetch('/api/series');
        if (!response.ok) {
          throw new Error('Response did not return 200');
        }
        const data = await response.json();
        setSeries(data);

        const responseCompanies = await fetch('/api/companies');
        if (!responseCompanies.ok) {
          throw new Error('Response did not return 200');
        }
        const companiesData = await responseCompanies.json();
        setCompanies(companiesData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []); 

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div>
      <NavBar/>
      <FloatingLogos/>
      <Graph 
        calculateAxies={() => calculateAxies(companies, getTopContendingCompanies)}
        name={'Average show scores for top 10 contending companies'}
      />
      <Graph 
        calculateAxies={() => calculateAxies(series, calcAvgNumSeasonsPerYear)}
        name={'Average number of seasons between cable vs streaming'}
      />
    </div>
  );
}
export default App;
