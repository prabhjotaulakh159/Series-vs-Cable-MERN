import './Dropdown.css';
export default function Dropdown({genres, setGenre}){
  return (
    <select className="dropdown" name="genre" onChange={e => setGenre(e.target.value)}>
      <option key="all-genres" value="">View All Genres</option>
      {
        genres.map(genre => <option key={genre} value={genre}>{genre}</option>)
      }
    </select>
  );
}