import 'react-loading-skeleton/dist/skeleton.css';
import './Summary.css';

function Summary({series}) {
  return (
    <section className="summary-block">
      {
        Object.keys(series).map(type => {
          if (!series[type].score) {
            return <h3 key={type}>No data available</h3>;
          }
          return (
            <div key={type} className="company-summary">
              <h3>Winning show in {type}</h3>
              <h3>{series[type].name}</h3>
              <p>Score: {series[type].score}</p>
              <p>Seasons: {series[type].numberOfSeasons}</p>
              <p>Year of release: {series[type].year}</p>
            </div>
          );
        })
      }
    </section>
  );
}

export default Summary;