import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { config } from '../config/env';

const defaultAxiosConfig: AxiosRequestConfig = {
  baseURL: `${config.apiURI}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env['AUTH_TOKEN']}`,
  },
};

/**
 * A basic HTTP service which uses Axios. Create a local instance of Axios
 * which can be fully customized.
 */
export class HTTPService {
  private axiosInstance: AxiosInstance;

  constructor(options: AxiosRequestConfig = defaultAxiosConfig) {
    this.axiosInstance = Axios.create({ ...options });
  }

  /**
   * Execute a `get` request using the local Axios instance.
   *
   * @param url url of the request, double-check if you are using a `baseURL`
   * @param config Axios request config
   */
  public get<T, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.axiosInstance.get(url, config);
  }

  /**
   * Execute a `delete` request using the local Axios instance.
   *
   * @param url url of the request, double-check if you are using a `baseURL`
   * @param config Axios request config
   */
  public delete<T, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.axiosInstance.delete(url, config);
  }

  /**
   * Execute a `post` request using the local Axios instance.
   *
   * @param url url of the request, double-check if you are using a `baseURL`
   * @param data data to send
   * @param config Axios request config
   */
  public post<T, R = AxiosResponse<T>>(url: string, data: any, config?: AxiosRequestConfig): Promise<R> {
    return this.axiosInstance.post(url, data, config);
  }

  /**
   * Execute a `put` request using the local Axios instance.
   *
   * @param url url of the request, double-check if you are using a `baseURL`
   * @param data data to send
   * @param config Axios request config
   */
  public put<T, R = AxiosResponse<T>>(url: string, data: any, config?: AxiosRequestConfig): Promise<R> {
    return this.axiosInstance.put(url, data, config);
  }

  /**
   * Execute a `patch` request using the local Axios instance.
   *
   * @param url url of the request, double-check if you are using a `baseURL`
   * @param data data to send
   * @param config Axios request config
   */
  public patch<T, R = AxiosResponse<T>>(url: string, data: any, config?: AxiosRequestConfig): Promise<R> {
    return this.axiosInstance.patch(url, data, config);
  }

  /**
   * Merge headers into the default Axios instance headers. Doesn't empty the
   * object but will overwrite already existing headers.
   *
   * @param headers an object of headers
   */
  public setDefaultHeaders(headers: { [header: string]: string }) {
    this.axiosInstance.defaults.headers = { ...headers };
  }

  /**
   * Return the default config of the axios instance.
   */
  public getDefaultConfig() {
    return this.axiosInstance.defaults;
  }
}
