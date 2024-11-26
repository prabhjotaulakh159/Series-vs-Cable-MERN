import './Search.css';
import { useState } from 'react';
import Card from './Card';

function Search() {
  const [data, setData] = useState({});
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [companyType, setcompanyType] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);

  function search(e) {
    e.preventDefault();
    setLoading(true);
    if (!name || !year || !companyType) {
      setError('Please ensure all 3 fields are complete');
      return;
    }
    fetch(`/api/series?name=${name}&year=${year}&type=${companyType}`).
      then(response => {
        if (!response.ok) throw new Error('Cannot fetch results for the moment');
        return response.json();
      }).
      then(data => {
        setData(data);
        if (error) setError('');
      }).
      catch(err => setError(err.message)).
      finally(() => setLoading(false));
  }

  return (
    <div className="search-container">
      <h2>Search Shows</h2>
      <form onSubmit={search}>
        <div className="input-group">
          <label htmlFor="name">Name:</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Filter by name" required />
        </div>
        <div className="input-group">
          <label htmlFor="companyType">Type:</label>
          <select id="companyType" value={companyType} required
            onChange={(e) => setcompanyType(e.target.value)}>
            <option value="">Select a company type</option>
            <option value="cable">cable</option>
            <option value="streaming">streaming</option>
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="year">Year:</label>
          <input id="year" type="number" value={year} onChange={(e) => setYear(e.target.value)}
            placeholder="Enter release year" min="2010" max="2024" required />
        </div>
        <button type="submit" className="search-button">Search</button>
      </form>

      { error && <p className="error">{error}</p> }
      { loading && <p className="loading">Loading...</p>}
      { 
        data && data.length > 0 ?
          <div className="results">
            {data.map((series, key) => {
              return <Card key={key} series={series}/>;
            })}
          </div> : 
          <p className="nothing">Nothing for the moment...</p>
      }
    </div>
  );
}

export default Search;