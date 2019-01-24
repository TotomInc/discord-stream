import Axios, { AxiosError } from 'axios';

import * as models from '../../models';
import logger, { logError } from '../../logger';

export default class SoundcloudAPI {
  private resolveBaseURL = 'http://api.soundcloud.com/resolve.json';
  private searchTrackURL = 'http://api.soundcloud.com/tracks';

  private clientID = process.env['SOUNDCLOUD_TOKEN'];

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
      .then((response) => response.data)
      .catch((error: AxiosError) => {
        logger.log('error', `soundcloud-api can\'t resolve an url: ${url}`);
        logError(error);
      });
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
      .then((response) => response.data)
      .catch((error: AxiosError) => {
        logger.log('error', `soundcloud-api can\'t search track with query: ${query}`);
        logError(error);
      });
  }
}
