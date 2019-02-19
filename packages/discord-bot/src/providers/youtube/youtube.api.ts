import Axios from 'axios';
import YTDL from 'ytdl-core';

import * as models from '../../models';
import { config } from '../../config/env';

export default class YoutubeAPI {
  private searchBaseURL = 'https://www.googleapis.com/youtube/v3/search';
  private playlistBaseURL = 'https://www.googleapis.com/youtube/v3/playlistItems';

  private key = config.tokens.youtube;

  /**
   * Get basic metadata from a YouTube video, uses YTDL.
   *
   * @param url the YouTube video URL
   */
  public getVideo(url: string) {
    return YTDL.getBasicInfo(url);
  }

  /**
   * Get basic metadata from the playlist. Doesn't fetch metadata (snippet)
   * from each video of the playlist, but only `videoID`s.
   *
   * @param playlistID the id of the playlist (URL parameter `list`)
   */
  public getPlaylist(playlistID: string) {
    const params = {
      playlistId: playlistID,
      maxResults: 50,
      part: 'snippet',
      key: this.key,
    };

    return Axios.get<models.YoutubePlaylistItems>(this.playlistBaseURL, { params })
      .then(response => response.data)
      .catch((error) => {});
  }

  /**
   * Search videos matching the query. Doesn't fetch metadata (snippet) from
   * each video of the search response list, but only `videoID`s.
   *
   * @param query a search query
   */
  public searchVideo(query: string) {
    const params = {
      q: query,
      type: 'video',
      part: 'snippet',
      key: this.key,
    };

    return Axios.get<models.YoutubeSearchListResponse>(this.searchBaseURL, { params })
      .then(response => response.data)
      .catch((error) => {});
  }
}
