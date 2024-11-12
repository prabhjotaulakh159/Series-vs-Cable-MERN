import {useRef, lazy, Suspense} from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './Graph.css';

function Graph({data, name}) {
  const plotRef = useRef(null);
  const Plot = lazy(() => import('react-plotly.js'));

  /* https://plotly.com/javascript/react/ */
  /* Notice the plotRef reference, this is what our observer is observing */
  return (
    <div className="graph-container" ref={plotRef} >
      <Suspense fallback={<Skeleton variant="rectangular" width={1000} height={500} count={1}/>}>
        <Plot
          data={data}
          layout={{ 
            width: '100%',
            title: name,
            font: {size: 18}
          }}
          config ={ {displayModeBar: false}}
        />
      </Suspense>
    </div>
  );
}

export default Graph;