import { useEffect, useState, useRef, lazy, Suspense, memo, useCallback } from 'react';
import Skeleton from 'react-loading-skeleton';
import PopUp from '../popup/PopUp';
import 'react-loading-skeleton/dist/skeleton.css';
import './Graph.css';

// memo the plot to avoid re-renders
const MemoPlot = memo(lazy(() => import('react-plotly.js')));

function Graph({ calculateAxies, name }) {
  const [showPlot, setShowPlot] = useState(false);
  const [data, setData] = useState([]);
  const plotRef = useRef(null);
  
  const showPopUp = useRef(false);
  const year = useRef(-1);
  const type = useRef('');
  const timeout = useRef(null);

  // this state is used to re-render the pop-up
  // we need this because our showPopUp and popUpData are not 
  // state variables, but refs. To have their updated value,
  // we need to force a re-render, using this state variables.
  // note: this will not cause the plot to be re-rendered, 
  // as it is memoized and it's functions are in useCallbacks.
  // only the pop-up will be re-rendered with the new data.
  const [, setPerformPopUp] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        const axiesData = calculateAxies();
        setData(axiesData);
        setShowPlot(true);
        observer.disconnect();
      }
    }, { root: null, rootMargin: '100px', threshold: 0.1 });

    if (plotRef.current) {
      observer.observe(plotRef.current);
    }

    return () => observer.disconnect();
  }, [calculateAxies]);

  const onHoverCallback = useCallback((e) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
    const point = e.points[0];
    showPopUp.current = true;
    year.current = point.x;
    type.current = point.name;
    setPerformPopUp(prev => !prev); 
  }, []);

  const onLeaveCallback = useCallback(() => {
    // give it some time to change the state
    // we need this if 2 points are very close to each other
    timeout.current = setTimeout(() => {
      showPopUp.current = false;
      setPerformPopUp(prev => !prev);
    }, 200); 
  }, []);

  return (
    <div className="graph-container" ref={plotRef}>
      {showPlot && 
        <Suspense fallback={<Skeleton variant="rectangular" width={1000} height={500} count={1} />}>
          <MemoPlot
            data={data}
            layout={{
              width: '100%',
              title: name,
              font: { size: 18 }
            }}
            config={{ displayModeBar: false }}
            // inside useCallbacks, there should be no re-render
            onHover={onHoverCallback} 
            onUnhover={onLeaveCallback}
          />
        </Suspense>
      }
      <HoverPopUp 
        showPopUp={showPopUp.current} 
        year={year.current} 
        chartName={name} />
    </div>
  );
}

function HoverPopUp({ showPopUp, year, chartName }) {
  return showPopUp ? <PopUp year={year} chartName={chartName} /> : null;
}

export default Graph;
