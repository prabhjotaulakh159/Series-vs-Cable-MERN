import './App.css';
import { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import SeriesList from './SeriesList';

function App() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(undefined);
  const [loadingSelected, setLoadingSelected] = useState(false);

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
    </div>
  );
}
export default App;
