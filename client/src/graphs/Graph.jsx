import {useEffect, useState, useRef} from 'react';
import Plot from 'react-plotly.js';

function Graph({calculateAxies}) {
  const [graphXAxis, setXAxis] = useState([]);
  const [graphYAxis, setYAxis] = useState([]);
  const [showPlot, setShowPlot] = useState(false);
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
    // async function loadData() {}
    // const { Plot } = await import('react-plotly.js');
    // instantiate a new observer to observe our plot
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;

      // if the plot is entering the view port
      if (entry.isIntersecting) {

        console.debug('entering the viewport');
        
        const {xAxis, yAxis} = calculateAxies();

        // we then set the approproate state
        setXAxis(xAxis);
        setYAxis(yAxis);
        setShowPlot(true);
        
        // stop observing
        observer.disconnect(); 
      }      
    }, 
    // these are some options for the observer
    {
      root: null,
      // start computing the plot when 200px above the plot
      rootMargin: '500px', 
      threshold: 0.1
    });

    // make it observe the plot
    if (plotRef.current) {
      console.debug('observing !!');
      observer.observe(plotRef.current);
    }

    // stop observing when leaving the component
    return () => observer.disconnect();
  });

  /* https://plotly.com/javascript/react/ */
  /* Notice the plotRef reference, this is what our observer is observing */
  return (
    <div ref={plotRef} >
      { 
        showPlot && <Plot
          data={[
            {
              x: graphXAxis,
              y: graphYAxis,
              type: 'scatter',
              mode: 'lines+markers',
              marker: {color: 'red'},
            },
            {type: 'bar', x: graphXAxis, y: graphYAxis},
          ]}
          layout={ {width: 2000, height: 1000, title: 'A Fancy Plot'} }
        /> 
      }
    </div>
  );
}

export default Graph;