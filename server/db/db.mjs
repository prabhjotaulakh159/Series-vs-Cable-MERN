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