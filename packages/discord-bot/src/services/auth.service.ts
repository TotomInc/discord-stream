import { AuthResponse } from '../models';
import { config } from '../config/env';
import { HTTPService } from './http.service';

/**
 * Basic authentication service which uses the HTTP service.
 */
export class AuthService {
  private httpService: HTTPService;

  constructor() {
    this.httpService = new HTTPService({
      baseURL: `${config.apiURI}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
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
      .catch(err => err);
  }

  /**
   * Store the JWT into a safe place which can be accessed without any
   * dependency.
   *
   * @param jwt authentication token for the API
   */
  private storeJWT(jwt: string) {
    process.env['AUTH_TOKEN'] = jwt;
  }
}
