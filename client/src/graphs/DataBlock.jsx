import { useEffect, useState, useRef } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import './DataBlock.css';
import Skeleton from 'react-loading-skeleton';
import Graph from './Graph.jsx';
import Summary from './Summary.jsx';

function DataBlock({ calculateAxies, name, fetchSummaryData, summaryTitle, id }) {
  const [showPlot, setShowPlot] = useState(false);
  const [data, setData] = useState(null);
  const [summary, setSummary] = useState(null);
  const plotRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting) {
          Promise.all([calculateAxies(), fetchSummaryData()]).
            then(([axiesData, summaryData]) => {
              setData(axiesData);
              setSummary(summaryData);
              setShowPlot(true);
            }).
            finally(() => {
              observer.disconnect(); 
            });
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    if (plotRef.current) {
      console.debug('Observing the plot area');
      observer.observe(plotRef.current);
    }

    return () => observer.disconnect();
  }, [calculateAxies, fetchSummaryData]);

  return (
    <div className="graph-block" ref={plotRef}>
      {showPlot ? 
        <>
          <h3 id={id} className="Graph-title">{name}</h3>
          <Graph data={data} name={name} />
          <h2 id={id} className="Summary-title">
            {summaryTitle}
          </h2>
          <Summary series={summary}/>
        </>
        : 
        <>
          <h4 className="loading-text">Heavy duty number crunching...</h4>
          <Skeleton variant="rectangular" width={1000} height={500} />
        </>
      }
    </div>
  );
}

export default DataBlock;
