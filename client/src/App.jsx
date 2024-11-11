import './App.css';
import 'react-loading-skeleton/dist/skeleton.css';
import NavBar from './navigation/NavBar';
import Graph from './graphs/Graph.jsx';
import { useState, useEffect, useCallback } from 'react';

/**
 * This function is a dumby function for now. in the future,
 * each graph will have its own way of customly calculating the series.
 * The catch: The functions for calculating the x and y axis MUST ALWAYS
 * RETURN AN OBJECT {xAxis, yAxis}!!! This naming convention IS IMPORTANT!!!
 * 
 * @param {Array} series - list of all series 
 * @returns - an object representing the x axis and y axis plots
 */
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

/**
 * This function is used in the line chart for the average scores per year
 * of cable versus streaming services.
 * Because each line chart needs an x axis and a y axis, this function returns
 * an array with 2 {xAxis, yAxis} objects 
 * 
 * @param {Array} series - list of all series 
 * @returns  - an array with 2 objects representing the x axis and y axis plots
 */
function calculateCompanyScoresPerYear(series){

  const onlyYears = series.map(show => show.year).filter(year => year);
  const uniqueYears = Array.from(new Set(onlyYears));
  let yAxis = uniqueYears.sort((a, b) => a - b);
  yAxis = yAxis.filter( year => year < 2025);

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
    const averageScore = totalScoreForYear / year.length;
    cableAverageScores.push(averageScore);
  });

  const streamingAverageScores = [];

  Object.keys(streamingSeriesByYear).forEach(year => {
    let totalScoreForYear = 0;
    streamingSeriesByYear[year].forEach(show => {
      totalScoreForYear += show.score;
    });
    const averageScore = totalScoreForYear / year.length;
    streamingAverageScores.push(averageScore);
  });

  return [{cableAverageScores, yAxis}, {streamingAverageScores, yAxis}];
  
}

function App() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateAxies = useCallback((data) => {
    return calculateAllAxies(data);
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
      <h1>All series: </h1>
      <Graph calculateAxies={() => calculateAxies(series)}/>
    </div>
  );
}
export default App;
