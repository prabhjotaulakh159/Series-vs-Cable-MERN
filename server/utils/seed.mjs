import {fetchToken, fetchAllSeries, fetchAllCompanies} from '../data-init.mjs';
import {db} from '../db/db.mjs';


(async () => {
  try {
    // necessary fetches and filtering to obtain data
    const token = await fetchToken();
    const series = await fetchAllSeries(token);
    const companies = await fetchAllCompanies(series, token);
    
    // insert series in the db
    await db.connect('webprojectdb', 'series');
    await db.deleteManySeries({});
    const numSeries = await db.createManySeries(series);
    console.debug(`Inserted ${numSeries} series`);

    // insert companies in the db
    await db.connect('webprojectdb', 'companies');
    await db.deleteManyCompanies({});
    const numCompanies = await db.createManyCompanies(companies);
    console.debug(`Inserted ${numCompanies} companies`);
  } catch (e) {
    console.error('could not seed');
    console.error(e);
  } finally {
    if (db) {
      db.close();
    }
    process.exit();
  }
})();