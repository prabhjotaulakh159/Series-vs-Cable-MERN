import './PopUp.css';

import { Suspense, useEffect, useState } from 'react';

function PopUp({year, chartName}) {
  const [starShow, setStarShow] = useState(undefined);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const url = `/api/series?year=${year}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Response did not return 2xx');
        }
        const json = await response.json();
        if (chartName === 'Average number of seasons between cable vs streaming') {
          const showWithMostNumberOfSeasonsForThatYear = 
            json.reduce((acc, curr) => {
              return curr.numberOfSeasons > acc.numberOfSeasons ? curr : acc;
            }, json[0]);
          setStarShow(showWithMostNumberOfSeasonsForThatYear);
        }
      } catch (error) {
        setError(error.message);
      }
    })();
  }, [chartName, year]);

  return (
    <section className="pop-up-container">
      { 
        chartName === 'Average number of seasons between cable vs streaming' && 
        <h2>Show with most number of seasons for the year {year}</h2>
      }
      {
        chartName === 'Average show scores per year<br>for streaming & cable companies' &&
        <h2>Show with the highest score for the year {year}</h2>
      }
      <h3>Title: {starShow?.name}</h3>
      <h3>Score: {starShow?.score}</h3>
      <h3>Seasons: {starShow?.numberOfSeasons}</h3>
      <h3>Company Type: {starShow?.companyType}</h3>
      <h3>Year of release: {starShow?.year}</h3>
      <img id="artwork" src={starShow?.artwork} alt=""/>
    </section>
  );
}

export default PopUp;