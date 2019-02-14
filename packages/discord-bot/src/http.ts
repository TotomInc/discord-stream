import axios from 'axios';

import { config } from './config/env';

const axiosInstance = axios.create({
  baseURL: `${config.apiURI}/api`,
});

/**
 * Init the Axios instance with the specified JWT, once initialized it can be
 * used everywhere without passing authorization header.
 *
 * @param jwt the JWT signed by the auth-server
 */
export function initAxiosInstance(jwt: string) {
  axiosInstance.defaults.headers['Authorization'] = `Bearer ${jwt}`;
}

export default axiosInstance;
