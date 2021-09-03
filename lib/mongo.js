const { MongoClient } = require('mongodb');
const { config } = require('../config');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = config.dbName;

// MongoAtlas does not require port to be configured, but it's a standard URI
// So we can configure the port if we change our DB service
const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${DB_NAME}?retryWrites=true&w=majority`;

class MongoLib {
  constructor() {
    this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true });
    this.dbName = DB_NAME;
  }

  connect() {
    if(!MongoLib.connection) {                              // If no connection exists, create a new one.
      MongoLib.connection = new Promise((res, rej) => {     // Our MongoLib class has a connection attribute, which is a promise.
        this.client.connect(err => {                        // The class client is an instance of MongoClient, which has a connect method.
          if(err) {                                         // This method has an error first callback.
            rej(err);
          }

          console.log('Connected successfully to mongo')
          res(this.client.db(this.dbName));                 // The db method creates new Db instance, we pass the name of the Db we want to use
        })                                                  // as a parameter 
      })
    }

    return MongoLib.connection;                             // If a connection already exists, returns it.
  }
}

module.exports = MongoLib;