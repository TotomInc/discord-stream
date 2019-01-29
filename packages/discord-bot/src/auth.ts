import axios from 'axios';
import dotenv from 'dotenv';

import * as models from './models';
import { initAxiosInstance } from './http';
import logger, { logError } from './logger';

dotenv.config({
  path: require('find-config')('.env'),
});

const JWT_SECRET = process.env['JWT_SECRET'];
const MONGO_SERVER_URL = process.env['MONGO_SERVER_URL'];

if (!JWT_SECRET) {
  throw new Error('No JWT_SECRET environment variable specified in the .env file');
}

if (!MONGO_SERVER_URL) {
  throw new Error('No MONGO_SERVER_URL environment variable specified in the .env file');
}

/**
 * Create an interval that will generate a new JWT every 30 minutes.
 */
export let jwtRevokeInterval = setInterval(() => {
  logger.log('info', 'start generation of a new jwt...');

  authenticate()
    .then((authResponse) => {
      if (authResponse && authResponse.auth && authResponse.token) {
        logger.log('info', 'new jwt successfully generated');
      }
    })
    .catch((err) => {
      logger.log('error', 'unable to generate a new jwt');
      logError(err);
    })
}, 1800 * 1000);

/**
 * Authenticate bot on the api auth-server and generate a JWT. If the
 * authentication is successful, automatically init the Axios Instance with
 * the new JWT.
 */
export async function authenticate() {
  const params = {
    secret: JWT_SECRET,
  };

  return await axios.get<models.AuthResponse>(`${MONGO_SERVER_URL}/api/auth`, { params })
    .then((response) => {
      if (response.data && response.data.token) {
        initAxiosInstance(response.data.token);
      }

      return response.data;
    })
    .catch((err) => {
      logger.log('error', 'unable to authenticate to the api and retrieve a JWT');
      logError(err);
    });
}
