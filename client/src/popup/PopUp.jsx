import './PopUp.css';

import { useEffect } from 'react';

function PopUp({data, chartTitle}) {
  useEffect(() => {

  }, [data]);
  
  return (
    <section className="pop-up-container">
      <h1 id="chart-title">{chartTitle}</h1>
      <section>
        <p>Showing data for: {data.data.name}</p>
        <p>Currently viewing for year: <br/>{data.x}</p>
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
    </section>
  );
}

export default PopUp;