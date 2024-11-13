import { useState, useRef, lazy, Suspense, memo, useCallback } from 'react';
import Skeleton from 'react-loading-skeleton';
import PopUp from '../popup/PopUp';
import 'react-loading-skeleton/dist/skeleton.css';
import './Graph.css';

// memo the plot to avoid re-renders
const MemoPlot = memo(lazy(() => import('react-plotly.js')));

function Graph({ data, name }) {
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

  const onHoverCallback = useCallback((e) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
    const point = e.points[0];
    showPopUp.current = true;
    year.current = point.x;
    type.current = point.data.name;
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
      <Suspense fallback={<Skeleton variant="rectangular" width={1000} height={500} count={1} />}>
        <MemoPlot
          data={data}
          layout={{ 
            title: name,
            font: {size: 12},
            legend: {
              x: 1,
              xanchor: 'right',
              y: 1
            }
          }}
          config ={{
            displayModeBar: false, 
            responsive: true 
          }}
          // inside useCallbacks, there should be no re-render
          onHover={onHoverCallback} 
          onUnhover={onLeaveCallback}
        />
      </Suspense>
      <HoverPopUp 
        showPopUp={showPopUp.current} 
        year={year.current} 
        type={type.current}
        chartName={name} 
      />
    </div>
  );
}
  
function HoverPopUp({ showPopUp, year, type, chartName }) {
  return showPopUp ? <PopUp year={year} type={type} chartName={chartName} /> : null;
}

export default Graph;
