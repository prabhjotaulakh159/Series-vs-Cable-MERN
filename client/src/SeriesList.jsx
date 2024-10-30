function SeriesList({ series, fetchIndividualSeries }) {
  return (
    <ul>
      {series?.slice(0, 100).map((show, key) => {
        return <li 
          onClick={() => fetchIndividualSeries(show.id)} 
          key={key}
        >ID: {show.id}, name: {show.name}, score: {show.score}, 
          seasons: {show.numberOfSeasons}, genres: {show.genres}</li>;
      })}
    </ul>
  );
}

export default SeriesList;