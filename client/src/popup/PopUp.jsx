import './PopUp.css';

import { useEffect, useState } from 'react';

const mapSeasons = new Map();
const mapScores = new Map();

function PopUp({year, chartName}) {
  const [starShow, setStarShow] = useState(undefined);
  const [error, setError] = useState('');

  useEffect(() => {
    const isSeasonChart = chartName === 'Average number of seasons between cable vs streaming';
  
    function setSeasonCache(json) {
      const showWithMostNumberOfSeasonsForThatYear = 
        json.reduce((acc, curr) => {
          return curr.numberOfSeasons > acc.numberOfSeasons ? curr : acc;
        }, json[0]);
      mapSeasons.set(year, showWithMostNumberOfSeasonsForThatYear);
      setStarShow(mapSeasons.get(year));
    }

    function setScoreCache(json) {
      const showWithHighestScoreForThatYear = 
        json.reduce((acc, curr) => {
          return curr.score > acc.score ? curr : acc;
        }, json[0]);
      mapScores.set(year, showWithHighestScoreForThatYear);
      setStarShow(mapScores.get(year));
    }

    async function getStreamingSeriesByYear() {
      const url = `/api/series?year=${year}&type=streaming`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Response did not return 2xx');
      }
      const json = await response.json();
      return json;
    }

    async function getCableSeriesByYear() {
      const url = `/api/series?year=${year}&type=cable`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Response did not return 2xx');
      }
      const json = await response.json();
      return json;
    }

    (async () => {
      if (isSeasonChart && mapSeasons.has(year)) {
        setStarShow(mapSeasons.get(year));
      } else if (mapScores.has(year)) {
        setStarShow(mapScores.get(year));
      } else {
        try {
          const cable = await getCableSeriesByYear();
          const streaming = await getStreamingSeriesByYear();
          if (isSeasonChart) {
            setSeasonCache(json);
          } else {
            setScoreCache(json);
          }
        } catch (error) {
          setError(error.message);
        }
      }
    })();
  }, [year, chartName]);

  return (
    <section className="pop-up-container">
      { error && <p>{error}</p> }
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