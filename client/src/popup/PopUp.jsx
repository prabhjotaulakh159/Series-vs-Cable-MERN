import './PopUp.css';

import { useEffect, useState } from 'react';

const mapSeasonsCable = new Map();
const mapSeasonStreaming = new Map();
const mapScoresCable = new Map();
const mapScoresStreaming = new Map();

function PopUp({year, type, chartName}) {
  const [starShow, setStarShow] = useState(undefined);
  const [error, setError] = useState('');

  useEffect(() => {
    const isSeasonChart = chartName === 'Average number of seasons between cable vs streaming';
    const isScoreChart = !isSeasonChart;
    const isCable = type?.toLowerCase().includes('cable');
    const isStreaming = !isCable;

    if (isSeasonChart && isCable && mapSeasonsCable.has(year)) {
      setStarShow(mapSeasonsCable.get(year));
      return;
    } 

    if (isSeasonChart && isStreaming && mapSeasonStreaming.has(year)) {
      setStarShow(mapSeasonStreaming.get(year));
      return;
    } 
    
    if (isScoreChart && isCable && mapScoresCable.has(year)) {
      setStarShow(mapScoresCable.get(year));
      return;
    } 
    
    if (isScoreChart && isStreaming && mapScoresStreaming.has(year)) {
      setStarShow(mapScoresStreaming.get(year));
      return;
    }

    function findShowWithMax(data, field) {
      return data.reduce((acc, curr) => {
        return curr[field] > acc[field] ? curr : acc;
      });
    }

    fetch(`/api/series?type=${type.toLowerCase()}&year=${year}`).
      then(res => res.json()).
      then(data => {
        const showToStore = 
          isSeasonChart ? findShowWithMax(data, 'numberOfSeasons') : findShowWithMax(data, 'score');
        if (isSeasonChart && isCable) {
          mapSeasonsCable.set(year, showToStore);
          setStarShow(mapSeasonsCable.get(year));
        } else if (isSeasonChart && isStreaming) {
          mapSeasonStreaming.set(year, showToStore);
          setStarShow(mapSeasonStreaming.get(year));
        } else if (isScoreChart && isCable) {
          mapScoresCable.set(year, showToStore);
          setStarShow(mapScoresCable.get(year));
        } else if (isScoreChart && isStreaming) {
          mapScoresStreaming.set(year, showToStore);
          setStarShow(mapScoresStreaming.get(year));
        }
      }).
      catch(error => setError(error.message));
  }, [year, chartName, type]);

  let title;

  if (chartName.includes('seasons') && type === 'cable') {
    title = `Cable show with highest number of seasons in the year ${year}`;
  }
  if (chartName.includes('seasons') && type === 'streaming') {
    title = `Streaming show with highest number of seasons in the year ${year}`;
  }
  if (chartName.includes('scores') && type === 'cable') {
    title = `Cable show with highest score in the year ${year}`;
  }
  if (chartName.includes('scores') && type === 'streaming') {
    title = `Streaming show with number score in the year ${year}`;
  }


  return (
    <section className="pop-up-container">
      { error && <p>{error}</p> }
      <h3>{title}</h3>
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