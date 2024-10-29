import './App.css';
import { useState, useEffect, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Plot from 'react-plotly.js';


function App() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(undefined);
  const [loadingSelected, setLoadingSelected] = useState(false);
  const [xAxisYears, setXAxisYears] = useState([]);
  const [yAxisShowsPerYear, setYAxisShowsPerYear] = useState([]);
  const [showPlot, setShowPlot] = useState(false);

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

  // using the intersection observer API to 'lazy load' the graph only when it's needed
  // not part of phase 1, but could be useful for later phases for performance
  // We can use the following code as a reference for phase 3 (performance)
  // Source for how to use the API in react:
  // https://dev.to/producthackers/intersection-observer-using-react-49ko
  // here's how to use it:
  // keep a reference to the plot using the useRef hook
  // the plotRef is used further down in a div
  const plotRef = useRef(null); 
  useEffect(() => {
    if (series.length === 0) {
      return;
    }
    // instantiate a new observer to observe our plot
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;

      // if the plot is entering the view port
      if (entry.isIntersecting) {

        console.log('entering the viewport');

        // we start computing the x and y axis
        const years = [];
        series?.forEach(show => {
          if (show.year !== 0 && !years.includes(show.year)) {
            years.push(show.year);
          }
        });
        years.sort((a, b) => a - b);
        const showsPerYear = years.map(year => {
          const showsForThatYear = series.filter(show => show.year === year).length;
          return showsForThatYear;
        });

        // we then set the approproate state
        setXAxisYears(prev => [...prev, ...years]);
        setYAxisShowsPerYear(prev => [...prev, ...showsPerYear]);
        setShowPlot(true);
        
        // stop observing
        observer.disconnect(); 
      }      
    }, 
    {
      root: null,
      // start triggering when 200px above the plot
      rootMargin: '200px', 
      threshold: 0.1
    });
    // make it observe the plot
    if (plotRef.current) {
      console.log('observing !!');
      observer.observe(plotRef.current);
    }

    return () => observer.disconnect();
  }, [series]);


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
        {series?.slice(0, 100).map((show, key) => {
          return <li 
            onClick={() => fetchIndividualSeries(show.id)} 
            key={key}
          >ID: {show.id}, name: {show.name}, score: {show.score}, 
            seasons: {show.numberOfSeasons}, genres: {show.genres}</li>;
        })}
      </ul>
      {/* https://plotly.com/javascript/react/ */}
      <div ref={plotRef} style={{minHeight: '600px'}} >
        {showPlot && <h1>hello world</h1> }
      </div>
      {/* { 
        showPlot && <Plot
          ref={plotRef} 
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
        /> } */}
    </div>
  );
}
export default App;
