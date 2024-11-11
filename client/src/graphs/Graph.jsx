import {useEffect, useState, useRef, lazy, Suspense} from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function Graph({calculateAxies, name}) {
  const [showPlot, setShowPlot] = useState(false);
  const [data, setData] = useState([]);
  const plotRef = useRef(null); 
  const Plot = lazy(() => import('react-plotly.js'));

  useEffect(() => {
    // instantiate a new observer to observe our plot
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;

      // if the plot is entering the view port
      if (entry.isIntersecting) {

        console.debug('entering the viewport');

        const axiesData = calculateAxies();

        const data = axiesData;

        setData(data);
        setShowPlot(true);
        
        // stop observing
        observer.disconnect(); 
      }      
    }, 
    // these are some options for the observer
    {
      root: null,
      // start computing the plot when 200px above the plot
      rootMargin: '100px', 
      threshold: 0.1
    });

    // make it observe the plot
    if (plotRef.current) {
      console.debug('observing !!');
      observer.observe(plotRef.current);
    }

    // stop observing when leaving the component
    return () => observer.disconnect();
  }, [calculateAxies]);

  /* https://plotly.com/javascript/react/ */
  /* Notice the plotRef reference, this is what our observer is observing */
  return (
    <div ref={plotRef} >
      {showPlot && 
        <Suspense fallback={<Skeleton variant="rectangular" width={1000} height={500} count={1}/>}>
          <Plot
            data={data}
            layout={{ 
              width: 2000, 
              height: 1000, 
              title: name,
              font: {size: 18}
            }}
            config ={ {displayModeBar: false}}
          />
        </Suspense>
      }
    </div>
  );
}

export default Graph;