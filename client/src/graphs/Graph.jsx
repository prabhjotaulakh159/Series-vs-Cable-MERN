import {useEffect, useState, useRef, lazy, Suspense} from 'react';
import Skeleton from 'react-loading-skeleton';
import PopUp from '../popup/PopUp';
import 'react-loading-skeleton/dist/skeleton.css';
import './Graph.css';

function Graph({calculateAxies, name}) {
  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpData, setPopUpData] = useState(undefined);
  const [showPlot, setShowPlot] = useState(false);
  const [data, setData] = useState([]);
  const plotRef = useRef(null); 
  const Plot = lazy(() => import('react-plotly.js'));

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;

      if (entry.isIntersecting) {

        console.debug('entering the viewport');

        const axiesData = calculateAxies();

        const data = axiesData;

        setData(data);
        setShowPlot(true);
        
        observer.disconnect(); 
      }      
    }, 
    {
      root: null,
      rootMargin: '100px', 
      threshold: 0.1
    });

    if (plotRef.current) {
      observer.observe(plotRef.current);
    }

    return () => observer.disconnect();
  }, [calculateAxies]);

  function onHoverOverDataPoint(e) {
    setShowPopUp(true);
    setPopUpData(e.points[0]);
  }

  function onLeavingDataPoint() {
    setShowPopUp(false);
  }

  return (
    <div className="graph-container" ref={plotRef} >
      {showPlot && 
        <Suspense fallback={<Skeleton variant="rectangular" width={1000} height={500} count={1}/>}>
          <Plot
            data={data}
            layout={{ 
              width: '100%',
              title: name,
              font: {size: 18}
            }}
            config ={ {displayModeBar: false}}
            onHover={onHoverOverDataPoint}
            onUnhover={onLeavingDataPoint}
          />
        </Suspense>
      }
      { showPopUp && <PopUp data={popUpData} chartTitle={name}/> }
    </div>
  );
}

export default Graph;