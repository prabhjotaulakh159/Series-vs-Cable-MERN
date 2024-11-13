import {useEffect, useState, useRef} from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import Graph from './Graph.jsx';
import Summary from './Summary.jsx';
import './DataBlock.css';

function DataBlock({calculateAxies, name, fetchSummaryData, summaryTitle, id}) {
  const [showPlot, setShowPlot] = useState(false);
  const [data, setData] = useState(false);
  const plotRef = useRef(null); 

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
    <div className="graph-block" ref={plotRef} >
      {showPlot && 
      <>
        <h3 id={id} className="Graph-title">
          {name}
        </h3>
        <Graph
          data={data}
        />
        <h2 id={id} >{summaryTitle}</h2>
        <Summary fetchSummaryData={fetchSummaryData} name={summaryTitle}/>
      </>
      }
    </div>
  );
}

export default DataBlock;