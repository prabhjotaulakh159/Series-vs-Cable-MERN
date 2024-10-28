import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';

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
        setLoading(false);
      }
    })();    
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ul>
      {series?.slice(0, 50).map((show, key) => {
        return <li key={key}>ID: {show.id}, name: {show.name}, score: {show.score}, 
          seasons: {show.numberOfSeasons}, genres: {show.genres}</li>;
      })}
    </ul>
  );
}
export default App;
