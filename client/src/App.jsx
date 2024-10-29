import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Plot from 'react-plotly.js';


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
        setSeries(prev => {
          return [...prev, ...data];
        });
      } catch (error) {
        setError(error.message);
      } finally {
        // simulate a long loading time with a timeout
        setTimeout(() => setLoading(false), 3000);
      }
    })();
  }, []);
  
  const xAxisYears = [];
  series?.forEach(show => {
    if (show.year !== 0 && !xAxisYears.includes(show.year)) {
      xAxisYears.push(show.year);
    }
  });
  xAxisYears.sort((a, b) => a - b);

  const yAxisShowsPerYear = xAxisYears.map(year => {
    const showsForThatYear = series.filter(show => show.year === year).length;
    return showsForThatYear;
  });

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
      setTimeout(() => setLoadingSelected(false), 3000);
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
      <ul>
        {series?.slice(0, 50).map((show, key) => {
          return <li 
            onClick={() => fetchIndividualSeries(show.id)} 
            key={key}
          >ID: {show.id}, name: {show.name}, score: {show.score}, 
            seasons: {show.numberOfSeasons}, genres: {show.genres}</li>;
        })}
      </ul>
      {/* https://plotly.com/javascript/react/ */}
      <Plot
        data={[
          {
            x: xAxisYears,
            y: yAxisShowsPerYear,
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},
          },
          {type: 'bar', x: xAxisYears, y: yAxisShowsPerYear},
        ]}
        layout={ {width: 2000, height: 1000, title: 'A Fancy Plot'} }
      />
    </div>
  );
}
export default App;
