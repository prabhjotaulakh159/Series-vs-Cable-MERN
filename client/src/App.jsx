import './App.css';
import { useState, useEffect, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Plot from 'react-plotly.js';
import SeriesList from './SeriesList';
import NavBar from './navigation/NavBar';

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
        setSeries(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []); 

  // using the intersection observer API to 'lazy load' the graph only when it's needed
  // We can use the following code as a reference for phase 3 (performance)
  // Source for how to use the API in react:
  // https://dev.to/producthackers/intersection-observer-using-react-49ko
  // ----
  // here's how to use it:
  // keep a reference to the plot we want to lazy load using the useRef hook
  // the plotRef variable is used further down in a div containing the <Plot/>
  const plotRef = useRef(null); 
  useEffect(() => {
    // instantiate a new observer to observe our plot
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;

      // if the plot is entering the view port
      if (entry.isIntersecting) {

        console.debug('entering the viewport');

        // we start computing the x and y axis
        const onlyYears = series.map(show => show.year).filter(year => year);
        const uniqueYears = Array.from(new Set(onlyYears));
        const sortedYears = uniqueYears.sort((a, b) => a - b);
        const showsPerYear = sortedYears.map(year => {
          const showsForThatYear = series.filter(show => show.year === year).length;
          return showsForThatYear;
        });

        // we then set the approproate state
        setXAxisYears(sortedYears);
        setYAxisShowsPerYear(showsPerYear);
        setShowPlot(true);
        
        // stop observing
        observer.disconnect(); 
      }      
    }, 
    // these are some options for the observer
    {
      root: null,
      // start computing the plot when 200px above the plot
      rootMargin: '200px', 
      threshold: 0.1
    });

    // make it observe the plot
    if (plotRef.current) {
      console.debug('observing !!');
      observer.observe(plotRef.current);
    }

    // stop observing when leaving the component
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
      <NavBar/>
      <h1>Currently selected series: 
        {loadingSelected ? <Skeleton width={'25%'}/> : selected?.id}
      </h1>
      <h1>All series: </h1>
      <SeriesList series={series} fetchIndividualSeries={fetchIndividualSeries}/>
      {/* https://plotly.com/javascript/react/ */}
      {/* Notice the plotRef reference, this is what our observer is observing */}
      <div ref={plotRef} >
        { 
          showPlot && <Plot
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
        }
      </div>
    </div>
  );
}
export default App;
