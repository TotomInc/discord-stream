import Axios, { AxiosError } from 'axios';

import * as models from '../../models';
import { config } from '../../config/env';
import { LoggerService } from '../../services/logger.service';

export default class SoundcloudAPI {
  private loggerService: LoggerService;

  private resolveBaseURL = 'http://api.soundcloud.com/resolve.json';
  private searchTrackURL = 'http://api.soundcloud.com/tracks';

  private clientID = config.tokens.soundcloud;

  constructor() {
    this.loggerService = new LoggerService();
  }

  /**
   * The resolve resource allows you to lookup and access API resources when
   * you only know the SoundCloud.com URL.
   *
   * @param url soundcloud url to resolve
   */
  public async resolveURL(url: string) {
    const params = {
      url,
      client_id: this.clientID,
    };

    return Axios.get<models.SoundcloudResponse>(this.resolveBaseURL, { params })
      .then(response => response.data)
      .catch((error: AxiosError) => this.loggerService.log.error(error, 'unable to resolve a SoundCloud URL: %s', url));
  }

  /**
   * Search a SoundCloud track based on the user query.
   *
   * @param query search-query for a SoundCloud track
   */
  public async searchTrack(query: string) {
    const params = {
      q: query,
      client_id: this.clientID,
    };

    return Axios.get<models.SoundcloudTrack[]>(this.searchTrackURL, { params })
      .then(response => response.data)
      .catch((error: AxiosError) => this.loggerService.log.error(error, 'unable to search tracks on SoundCloud query: %s', query));
  }
}
