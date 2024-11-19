import './App.css';
import DataBlock from './graphs/DataBlock.jsx';
import TitleView from './TitleView.jsx';
import Footer from './Footer.jsx';
import 'react-loading-skeleton/dist/skeleton.css';
import NavBar from './navigation/NavBar';
import { useState, useEffect, useCallback } from 'react';

import { 
  getTopContendingCompanies, 
  calcAvgNumSeasonsPerYear, 
  calculateCompanyScoresPerYear,
  fetchHighestRatedShowAmongCompanies,
  fetchCompaniesWithHighestScores,
  fetchLongestShowForTypes
} from './utils.js';

function App() {
  const [series, setSeries] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateAxies = useCallback((data, calculateAxiesFunction) => {
    return calculateAxiesFunction(data);
  }, []);

  const fetchSummaryData = useCallback((companies, series, fetchData) => {
    return fetchData(companies, series);
  }, []);


  useEffect(() => {
    (async () => {
      setLoading(true);
      try { 
        const response = await fetch('/api/series');
        if (!response.ok) {
          throw new Error(`Not a 2xx response, ${response.status}, 
            ${response.statusText ? response.statusText : ''}`, 
          {cause: response});
        }
        const data = await response.json();
        const highestScore = Math.max(...data.map(show => show.score));
        data.map (show => {
          show.score = show.score * 100 / highestScore;
        });
        setSeries(data);

        const responseCompanies = await fetch('/api/companies');
        if (!responseCompanies.ok) {
          throw new Error(`Not a 2xx response, ${response.status}, 
            ${response.statusText ? response.statusText : ''}`, 
          {cause: response});
        }
        const companiesData = await responseCompanies.json();
        setCompanies(companiesData);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []); 

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <main>
      <section id="main-app">
        <NavBar/>
        <TitleView/>
        <section id="mainPage">
          <DataBlock 
            id="graph1"
            calculateAxies={() => calculateAxies(companies, getTopContendingCompanies)}
            name={'Average show scores for top 10 contending companies'}
            fetchSummaryData={() => 
              fetchSummaryData(companies, series, fetchHighestRatedShowAmongCompanies)
            }
            summaryTitle={'Best performing shows in the top companies'}
          />
          <DataBlock 
            id="graph2"
            calculateAxies={() => calculateAxies(series, calcAvgNumSeasonsPerYear)}
            name={'Average number of seasons between cable vs streaming'}
            fetchSummaryData={() => 
              fetchSummaryData(companies, series, fetchLongestShowForTypes)
            }
            summaryTitle={'Longest shows for cable and series'}
          />
          <DataBlock
            id="graph3"
            calculateAxies={() => calculateAxies(series, calculateCompanyScoresPerYear)}
            name={'Average show scores per year for streaming & cable companies'}
            fetchSummaryData={() => 
              fetchSummaryData(companies, series, fetchCompaniesWithHighestScores)
            }
            summaryTitle={'Highest scoring shows for cable and series'}
          />
        </section>
      </section>
      <Footer/>
    </main>
  );
}

export default App;
