import { Stream } from '@discord-stream/models';
import { Readable } from 'stream';
import { URL } from 'url';
import Discord from 'discord.js';
import YTDL from 'ytdl-core';
import to from 'await-to-js';

import { ProviderHandler } from '@/handler';
import YoutubeAPI from '@api/YoutubeAPI';

export default class YoutubeHandler extends ProviderHandler {
  /**
   * Core logic to fetch a single video, a playlist or search results from the
   * YouTube API. Make sure to parse API results as a `Stream.Track` object.
   *
   * @param query an url or a search query
   * @param message the discord message that initiated this
   */
  public async fetchTrack(query: string, message: Discord.Message): Promise<Stream.ITrack[]> {
    const tracks: Stream.ITrack[] = [];
    const isValidURL = this.isURL(query);
    const isVideo = (isValidURL) ? YoutubeHandler.isVideo(query) : false;
    const isPlaylist = (isValidURL) ? YoutubeHandler.isPlaylist(query) : false;

    // If we have a valid URL (and not a search query), fetch URL metadata
    if (isValidURL) {
      // If URL is a video
      if (isVideo && !isPlaylist) {
        const [err, videoMetadata] = await to(YoutubeAPI.getVideo(query));
  
        if (!err && videoMetadata) {
          const mappedTrack: Stream.ITrack = this.mapTrack(videoMetadata, message);

          tracks.push(mappedTrack);
        }
      }
      // If URL is a playlist
      else if (!isVideo && isPlaylist) {
        const playlistID = YoutubeHandler.getPlaylistID(query)!;
        const [err, playlistMetadata] = await to(YoutubeAPI.getPlaylist(playlistID));
  
        if (!err && playlistMetadata) {
          const playlistVideoIDs = playlistMetadata.items.map(item => item.snippet.resourceId.videoId);
  
          for (const videoID of playlistVideoIDs) {
            const videoURL = `https://youtube.com/watch?v=${videoID}`;
            const [videoErr, videoMetadata] = await to(YoutubeAPI.getVideo(videoURL));
  
            if (!videoErr && videoMetadata) {
              const mappedTrack: Stream.ITrack = this.mapTrack(videoMetadata, message);

              tracks.push(mappedTrack);
            }
          }
        }
      }
    }
    // If we don't have a valid URL, we assume it's a search-query
    else {
      const [err, videoSearchResults] = await to(YoutubeAPI.searchVideo(query));
  
      if (!err && videoSearchResults) {
        // Make sure to extract only the first 3 search results
        const firstVideosResults = videoSearchResults.items.slice(0, 3);
  
        for (const video of firstVideosResults) {
          const [videoErr, videoMetadata] = await to(YTDL.getBasicInfo(video.id.videoId));
  
          if (!videoErr && videoMetadata) {
            const mappedTrack: Stream.ITrack = this.mapTrack(videoMetadata, message);

            tracks.push(mappedTrack);
          }
        }
      }
    }
  
    return tracks;
  }

  /**
   * Fetch and returns an `internal.Readable` stream, using YTDL.
   *
   * @param track the track object containing metadata
   */
  public getReadableStream(track: Stream.ITrack): Readable {
    return YTDL(track.streamURL, {
      filter: 'audioonly',
      highWaterMark: 1 << 25,
    });
  }

  /**
   * Map the video metadata fetched from YTDL to a `Stream.Track` object.
   *
   * @param video metadata of the video fetched from YouTube API
   * @param message initiator of the track
   */
  public mapTrack(video: YTDL.videoInfo, message: Discord.Message): Stream.ITrack {
    return {
      provider: 'youtube',
      url: video.video_url,
      streamURL: video.video_url,
      title: video.player_response.videoDetails.title,
      description: video.description,
      views: video.player_response.videoDetails.viewCount.toString(),
      thumbnailURL: video.thumbnail_url,
      duration: video.length_seconds,
      initiator: message,
    };
  }

  /**
   * Detect if URL is a YouTube video by using YTDL module.
   *
   * @param url url of a potential YouTube video
   */
  public static isVideo(url: string): boolean {
    return YTDL.validateURL(url);
  }

  /**
   * Detect if URL is a YouTube playlist by detecting `list` URL parameter.
   *
   * @param url url of a potential YouTube playlist
   */
  public static isPlaylist(url: string): boolean {
    return new URL(url).searchParams.has('list');
  }

  /**
   * Extract the playlist ID from a YouTube playlist URL by seaching for the
   * `list` URL parameter.
   *
   * @param url url of a YouTube playlist
   */
  public static getPlaylistID(url: string): string | null {
    return new URL(url).searchParams.get('list');
  }
}
