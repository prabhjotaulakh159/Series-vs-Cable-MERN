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
      this.seriesCollection = null;
      this.companiesCollection = null;
    }
    return instance;
  }


  /* Connects to the db using the db name and collection name */
  async connect(dbname) {
    if (instance.db){
      return;
    }
    await instance.client.connect();
    instance.db = await instance.client.db(dbname);
    // Send a ping to confirm a successful connection
    await instance.client.db(dbname).command({ ping: 1 });
    instance.seriesCollection = await instance.db.collection('series');
    instance.companiesCollection = await instance.db.collection('companies');
  }

  /* Closes the db connection */
  async close() {
    await instance.client.close();
    instance = null;
  }

  /* Retrieves all series from the database */
  async readAllSeries() {
    return await instance.seriesCollection.find().toArray();
  }

  /* Inserts {series} in the database  */
  async createManySeries(series) {
    return await instance.seriesCollection.insertMany(series);
  }

  /* Deletes all series from the database */
  async deleteManySeries(query) {
    return await instance.seriesCollection.deleteMany(query);
  }

  /* Retrieves all companies from the database */
  async readAllCompanies() {
    return await instance.companiesCollection.find().toArray();
  }

  /* Inserts {companies} in the database  */
  async createManyCompanies(companies) {
    return await instance.companiesCollection.insertMany(companies);
  }

  /* Deletes all companies from the database */
  async deleteManyCompanies(query) {
    if (!instance.companiesCollection) {
      return await instance.companiesCollection.deleteMany(query);
    }
    return;
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
      query.year = Number(year);
    }
    if (type) {
      query.type = type;
    }
    // the find method takes an object { name: name, year: year, type: type }
    // however, we only add those keys if we actually want them, meaning 
    // they are truthy from the request query parameters. If only name is 
    // required, the object in find will simply be { name: name }, and it 
    // filter only by name
    const seriesFiltered = await instance.seriesCollection.find(query).toArray();
    return seriesFiltered;
  }

  /**
   * retrieves series based on an id
   * @param {Number} id - The id of the series
   * @return An object representing the id of the series to find
   */
  async getSeriesById(id){
    const query = {id:Number(id)};
    const series = await instance.seriesCollection.findOne(query);
    return series;
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