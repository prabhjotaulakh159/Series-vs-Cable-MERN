import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';

const dbUrl = process.env.ATLAS_URI;
let instance = null;

/** 
 * Code taken from the following lab:
 * https://dawsoncollege.gitlab.io/520JS/520-Web/exercises/09_2_mongo_express.html 
 */
class DB {
  constructor(){
    //instance is the singleton, defined in outer scope
    if (!instance){
      instance = this;
      this.client = new MongoClient(dbUrl, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
      this.db = null;
      this.collection = null;
    }
    return instance;
  }


  /* Connects to the db using the db name and collection name */
  async connect(dbname, collName) {
    if (instance.db){
      return;
    }
    await instance.client.connect();
    instance.db = await instance.client.db(dbname);
    // Send a ping to confirm a successful connection
    await instance.client.db(dbname).command({ ping: 1 });
    instance.collection = await instance.db.collection(collName);
  }

  /* Closes the db connection */
  async close() {
    await instance.client.close();
    instance = null;
  }

  /* Retrieves all series from the database */
  async readAll() {
    return await instance.collection.find().toArray();
  }

  /**
   * Retrives series based on name, year and type
   * @param {String} name - Name of series to filter with
   * @param {String} year - Year of series to find
   * @param {String} type - Type of series (cable, streaming)
   * @return An array of series based on the filters
   */
  async getFilteredSeries(name, year, type) {
    const query = {};
    if (name) {
      // https://stackoverflow.com/questions/10610131/checking-if-a-field-contains-a-string
      // i stands for case-insensitivity 
      query.name = { $regex : name, $options : 'i' }; 
    }
    if (year) {
      query.year = year;
    }
    if (type) {
      query.type = type;
    }
    const seriesFiltered = await instance.collection.find(query).toArray();
    return seriesFiltered;
  }

  /* opens a connection to the db using the db name and collection name */
  async open(dbname, collName) {
    try {
      await instance.connect(dbname, collName);
    } finally {
      await instance.close();
    }
  }
}

export const db = new DB();