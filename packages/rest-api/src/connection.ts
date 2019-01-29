import { MongoClient } from 'mongodb';

const isProduction = process.env['NODE_ENV'] === 'production';

const productionURL = process.env['MONGO_CONNECTION_STRING'] as string | undefined;
const developmentURL = 'mongodb://localhost:27017/discord-stream';
const mongoConnectionURL = (isProduction) ? productionURL : developmentURL;

let _connection: Promise<MongoClient> | undefined;

/**
 * `MONGO_CONNECTION_STRING` env. variable must be setup properly depending
 * on the environment to be used by the `mongodb` driver.
 */
process.env['MONGO_CONNECTION_STRING'] = mongoConnectionURL;

/**
 * Returns a promise of a `MongoClient` object. Subsequent calls to this
 * function returns the **same** promise, so it can be called any number of
 * times without setting up a new connection every time.
 */
export function connection() {
  if (!_connection) {
    _connection = _connect();
  }

  return _connection;
}

/**
 * Try to connect to the db, throw an error if the `MONGO_CONNECTION_STRING`
 * env. variable is not set. This is used internally by the `connection()`
 * function.
 */
function _connect() {
  if (!mongoConnectionURL) {
    throw new Error('Environment variable MONGO_CONNECTION_STRING must be set.');
  }

  return MongoClient.connect(mongoConnectionURL, {
    useNewUrlParser: true,
  });
}
