import axios from 'axios';
import dotenv from 'dotenv';

import * as models from './models';
import { initAxiosInstance } from './http';
import logger, { logError } from './logger';
import { config } from './config/env';

dotenv.config({
  path: require('find-config')('.env'),
});

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
    secret: config.secrets.jwt,
  };

  return await axios.get<models.AuthResponse>(`${config.apiURI}/api/auth`, { params })
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
