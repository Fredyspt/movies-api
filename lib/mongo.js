const { MongoClient, ObjectId } = require('mongodb');
const { config } = require('../config');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = config.dbName;

// MongoAtlas does not require port to be configured, but it's a standard URI
// So we can configure the port if we change our DB service
const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}/${DB_NAME}?retryWrites=true&w=majority`;

class MongoLib {
  constructor() {
    this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true });
    this.dbName = DB_NAME;
  }

  connect() {
    // If no connection exists, create a new one.
    if (!MongoLib.connection) {
      // Our MongoLib class has a connection attribute, which is a promise.
      MongoLib.connection = new Promise((res, rej) => {
        // The class client is an instance of MongoClient, which has a connect method.
        // This method has an error first callback.
        this.client.connect((err) => {
          if (err) {
            rej(err);
          }

          console.log('Connected successfully to mongo');
          // The db method creates new Db instance, we pass the name of the Db we want to use
          // as a parameter
          res(this.client.db(this.dbName));
        });
      });
    }
    // If a connection already exists, returns it.
    return MongoLib.connection;
  }

  getAll(collection, query) {
    return this.connect().then((db) => {
      // We pass the collection we want to retrieve and transform
      // result to array to facilitate JSON conversion
      return db.collection(collection).find(query).toArray();
    });
  }

  get(collection, id) {
    return this.connect().then((db) => {
      return db.collection(collection).findOne({ _id: ObjectId(id) });
    });
  }

  create(collection, data) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).insertOne(data);
      })
      .then((result) => result.insertedId);
  }

  update(collection, id, data) {
    return this.connect()
      .then((db) => {
        // $set: data -> to update object data with the new data
        // upsert: true -> to update object or insert object if it doesn't exists
        return db
          .collection(collection)
          .updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true });
      })
      .then((result) => result.upsertedId || id);
  }

  delete(collection, id) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).deleteOne({ _id: ObjectId(id) });
      })
      .then(() => id);
  }
}

module.exports = MongoLib;
