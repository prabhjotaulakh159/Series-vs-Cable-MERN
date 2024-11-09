import './App.css';
import Graph from './graphs/Graph.jsx';
import { useState, useEffect, useCallback } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import SeriesList from './SeriesList';


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

function App() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(undefined);
  const [loadingSelected, setLoadingSelected] = useState(false);

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


  async function fetchIndividualSeries(id) {
    try {
      setLoadingSelected(true);
      const response = await fetch(`/api/series/${id}`);
      if (!response.ok) {
        throw new Error('Response did not return 200');
      }
      const data = await response.json();
      setSelected(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingSelected(false);
    }
  }

  if (loading) {
    return <Skeleton width={'25%'} count={50}/>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div>
      <h1>Currently selected series: 
        {loadingSelected ? <Skeleton width={'25%'}/> : selected?.id}
      </h1>
      <h1>All series: </h1>
      <SeriesList series={series} fetchIndividualSeries={fetchIndividualSeries}/>
      <Graph calculateAxies={() => calculateAxies(series)}/>
    </div>
  );
}
export default App;
