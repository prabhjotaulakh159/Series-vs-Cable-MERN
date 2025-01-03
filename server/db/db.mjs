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
      this.db = null;
      this.seriesCollection = null;
      this.companiesCollection = null;
    }
    return instance;
  }


  /* Connects to the db using the db name and collection name */
  async connect(dbname) {
    this.client = new MongoClient(dbUrl, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
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
    return await instance.companiesCollection.deleteMany(query);
  }

  /* Gets all genres in the db */
  async getAllGenres() {
    const result =  await instance.seriesCollection.aggregate([
      { $unwind: '$genres' },
      { $group: { _id: null, uniqueGenres: { $addToSet: '$genres' } } },
      { $project: { _id: 0, uniqueGenres: 1 } }
    ]).toArray();

    return result.length > 0 ? result[0].uniqueGenres : [];
  }
  
  /**
   * Retrives series based on name, year and type
   * @param {String} name - Name of series to filter with
   * @param {String} year - Year of series to find
   * @param {String} type - Type of series (cable, streaming)
   * @return An array of series based on the filters
   */
  async getFilteredSeries(name, year, type, genre) {
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
      query.companyType = type;
    }
    if (genre) {
      query.genres = { $elemMatch: { $regex: genre, $options: 'i' } };
    }
    // the find method takes an object { name: name, year: year, type: type }
    // however, we only add those keys if we actually want them, meaning 
    // they are truthy from the request query parameters. If only name is 
    // required, the object in find will simply be { name: name }, and it 
    // filter only by name
    // { $and: [ { scores: 75, name: "Greg Powell" } ] }
    const seriesFiltered = await instance.seriesCollection.find(query).project({_id:0}).toArray();
    return seriesFiltered;
  }

  /**
   * retrieves series based on an id
   * @param {Number} id - The id of the series
   * @return An object representing the id of the series to find
   */
  async getSeriesById(id){
    const query = {'id':Number(id)};
    const series = await instance.seriesCollection.findOne(query);
    if (series) delete series._id;
    return series;
  }

  /**
   * 
   * @param {String} type - represents the company type we want to filter by
   * @returns - the filtered companies by type
   */
  async getFilteredCompanies(type) {
    const query = {};
    if (type) {
      query.type = type;
    }

    const filteredCompanies = 
      await instance.companiesCollection.find(query).project({_id:0}).toArray();
    return filteredCompanies;
  }

  /**
   * Gets a company by ID
   * @param { Number } id - ID of company to fetch
   */
  async getCompanyById(id) {
    const query = { id: Number(id) };
    const company = await instance.companiesCollection.findOne(query);
    if (company) delete company._id;
    return company;
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