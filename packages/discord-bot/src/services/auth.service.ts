import { AuthResponse } from '../models';
import { config } from '../config/env';
import { HTTPService } from './http.service';
import { LoggerService } from './logger.service';

/**
 * Basic authentication service which uses the HTTP service.
 */
export class AuthService {
  private httpService: HTTPService;
  private loggerService: LoggerService;

  constructor() {
    this.httpService = new HTTPService({
      baseURL: `${config.apiURI}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.loggerService = new LoggerService();
  }

  /**
   * Try to authenticate the user and generate a JWT. If successfull, store the
   * JWT.
   */
  public authenticate(): Promise<AuthResponse | void> {
    const data = {
      secret: config.secrets.jwt,
    };

    return this.httpService.post<AuthResponse | undefined>('/auth', data)
      .then((response) => {
        if (response.data && response.data.token) {
          this.storeJWT(response.data.token);
        }

        return response.data;
      })
      .catch(err => this.loggerService.log.error(err, 'unable to retrieve a JWT from the API'));
  }

  /**
   * Store the JWT into a safe place which can be accessed without any
   * dependency.
   *
   * @param jwt authentication token for the API
   */
  private storeJWT(jwt: string) {
    process.env['AUTH_TOKEN'] = jwt;

    this.loggerService.log.info('generated and stored a JWT from the API: %s', jwt);
  }
}
