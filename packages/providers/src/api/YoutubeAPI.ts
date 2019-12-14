import { Youtube } from '@discord-stream/models';
import Axios from 'axios';
import YTDL from 'ytdl-core';

import { config } from '../config';

export default class YoutubeAPI {
  private static searchBaseURL = 'https://www.googleapis.com/youtube/v3/search';
  private static playlistBaseURL = 'https://www.googleapis.com/youtube/v3/playlistItems';

  private static key = config.tokens.youtube;

  /**
   * Get basic metadata from a YouTube video, uses YTDL.
   *
   * @param url the YouTube video URL
   */
  public static async getVideo(url: string): Promise<YTDL.videoInfo> {
    return YTDL.getBasicInfo(url);
  }

  /**
   * Get basic metadata from the playlist. Doesn't fetch metadata (snippet)
   * from each video of the playlist, but only `videoID`s.
   *
   * @param playlistID the id of the playlist (URL parameter `list`)
   */
  public static async getPlaylist(playlistID: string): Promise<Youtube.PlaylistItems> {
    const params = {
      playlistId: playlistID,
      maxResults: 50,
      part: 'snippet',
      key: this.key,
    };

    return Axios.get<Youtube.PlaylistItems>(YoutubeAPI.playlistBaseURL, { params })
      .then(response => response.data);
  }

  /**
   * Search videos matching the query. Doesn't fetch metadata (snippet) from
   * each video of the search response list, but only `videoID`s.
   *
   * @param query a search query
   */
  public static async searchVideo(query: string): Promise<Youtube.SearchListResponse> {
    const params = {
      q: query,
      type: 'video',
      part: 'snippet',
      key: YoutubeAPI.key,
    };

    return Axios.get<Youtube.SearchListResponse>(YoutubeAPI.searchBaseURL, { params })
      .then(response => response.data);
  }
}
