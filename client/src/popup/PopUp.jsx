import './PopUp.css';

import { useEffect, useState } from 'react';

function PopUp({data, chartTitle}) {
  const [show, setShow] = useState(null);
  const [error, setError] = useState('');
  
  useEffect(() => {
    (async () => {
      if (chartTitle === 'Average number of seasons between cable vs streaming') {
        const maxNumSeasons = Math.max(...data.data.y);
        const indexOfYearWithMaxNumSeasons = data.data.y.indexOf(maxNumSeasons);
        const type = data.data.name.toLowerCase();
        const year = data.data.x[indexOfYearWithMaxNumSeasons];
        const url = `/api/series?type=${type}&year=${year}`;
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error('Response did not return 2xx');
          const json = await response.json();
          const showWithMaxNumSeasons = json.reduce((max, current) => 
            current.numberOfSeasons > max.numberOfSeasons ? current : max);
          setShow(showWithMaxNumSeasons);          
        } catch (error) {
          setError(error.message);
        }
      }
    })();
  }, [chartTitle, data]);
  
  return (
    <section className="pop-up-container">
      <h1 id="chart-title">{chartTitle}</h1>
      <section>
        <p>Showing data for: {data.data.name}</p>
        <p>Currently viewing for year/company: <br/>{data.x}</p>
        <p>{data.y.toFixed(2)}</p>
      </section>
      <section id="list-container">
        <ul>
          {data.data.x.map((x, key) => {
            return <li key={key}>{x}</li>;
          })}
        </ul>
        <ul>
          {data.data.y.map((y, key) => {
            return <li key={key}>{y.toFixed(2)}</li>;
          })}
        </ul>
      </section>
      <img id="artwork" src={show?.artwork} />
    </section>
  );
}

export default PopUp;