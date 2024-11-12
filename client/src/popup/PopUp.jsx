import './PopUp.css';

function PopUp({data, chartTitle}) {
  return (
    <section className="pop-up-container">
      <h1 id="chart-title">{chartTitle}</h1>
      <section>
        <p>Showing data for: {data.data.name}</p>
        <p>Currently viewing for year/company: <br/>{data.x}</p>
        <p>{data.y.toFixed(2)}</p>
      </section>
    </section>
  );
}

export default PopUp;