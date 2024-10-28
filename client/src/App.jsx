import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


function App() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try { 
        const response = await fetch('/api/series');
        if (!response.ok) {
          throw new Error('Response did not return 200');
        }
        const data = await response.json();
        setSeries(prev => {
          return [prev, ...data];
        });
      } catch (error) {
        setError(error.message);
      } finally {
        // simulate a long loading time with a timeout
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      }
    })();
  }, []);

  if (loading) {
    return <Skeleton width={'25%'} count={50}/>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div>
      <ul>
        {series?.slice(0, 50).map((show, key) => {
          return <li key={key}>ID: {show.id}, name: {show.name}, score: {show.score}, 
            seasons: {show.numberOfSeasons}, genres: {show.genres}</li>;
        })}
      </ul>
    </div>
  );
}
export default App;
