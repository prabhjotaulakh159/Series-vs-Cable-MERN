import {fetchToken, fetchAllSeries} from '../data-init.mjs';
import {db} from '../db/db.mjs';

let series;

(async () => {
  try {
    const token = await fetchToken();
    series = await fetchAllSeries(token);
    await db.connect('webprojectdb', 'series');
    const num = await db.createMany(series);
    console.log(`Inserted ${num} series`);
  } catch (e) {
    console.error('could not seed');
    console.dir(e);
  } finally {
    if (db) {
      db.close();
    }
    process.exit();
  }
})();