import { Soundcloud } from '@discord-stream/models';
import Axios from 'axios';

import { config } from '../config';

export default class SoundcloudAPI {
  private static resolveBaseURL = 'http://api.soundcloud.com/resolve.json';
  private static searchTrackURL = 'http://api.soundcloud.com/tracks';

  private static clientID = config.tokens.soundcloud;

  /**
   * Resolve SoundCloud URL, retrieve kind of the ressource requested.
   *
   * @param url soundcloud url to resolve
   */
  public static async resolveURL(url: string) {
    const params = {
      url,
      client_id: SoundcloudAPI.clientID,
    };

    return Axios.get<Soundcloud.Response>(this.resolveBaseURL, { params })
      .then(response => response.data);
  }

  /**
   * Search a SoundCloud track based on the user query.
   *
   * @param query search-query for a SoundCloud track
   */
  public static async searchTrack(query: string) {
    const params = {
      q: query,
      client_id: SoundcloudAPI.clientID,
    };

    return Axios.get<Soundcloud.Track[]>(SoundcloudAPI.searchTrackURL, { params })
      .then(response => response.data);
  }
}
