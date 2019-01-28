import axios from 'axios';

const API_URL = process.env['MONGO_SERVER_URL'];

if (!API_URL) {
  throw new Error('No MONGO_SERVER_URL environment variable found in .env file');
}

const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
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
