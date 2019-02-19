import { Readable } from 'stream';
import { URL } from 'url';
import Discord from 'discord.js';
import YTDL from 'ytdl-core';
import to from 'await-to-js';

import { isURL } from '../../utils/url';
import * as models from '../../models';
import * as YoutubeGuard from './youtube.guard';
import YoutubeAPI from './youtube.api';
import logger, { logError } from '../../logger';

const api = new YoutubeAPI();

/**
 * Call the right method to fetch metadata of track(s) depending on the query
 * type. Returns an array of potential tracks to be queued.
 *
 * @param query an url or a search query
 * @param message the discord message that initiated this
 */
export async function fetchHandler(query: string, message: Discord.Message): Promise<models.Track[]> {
  const tracks: models.Track[] = [];
  const isValidURL = isURL(query);
  const isVideo = (isValidURL) ? YoutubeGuard.isVideo(query) : false;
  const isPlaylist = (isValidURL) ? YoutubeGuard.isPlaylist(query) : false;

  if (isValidURL) {
    if (isVideo && !isPlaylist) {
      const [err, videoMetadata] = await to(api.getVideo(query));

      if (err || !videoMetadata) {
        logger.log('error', 'youtube-handler can\'t fetch a video metadata from the fetchHandler');
        logError(err);
      } else {
        tracks.push(mapVideoTrack(videoMetadata, message));
      }
    } else if (isPlaylist) {
      const playlistID = getPlaylistID(query)!;
      const [err, playlistMetadata] = await to(api.getPlaylist(playlistID));

      if (err || !playlistMetadata) {
        logger.log('error', 'youtube-handler can\'t fetch playlist metadata from the fetchHandler');
        logError(err);
      } else {
        const playlistVideoIDs = playlistMetadata.items.map(item => item.snippet.resourceId.videoId);

        for (const videoID of playlistVideoIDs) {
          const [videoErr, videoMetadata] = await to(api.getVideo(buildURLFromID(videoID)));

          if (videoErr || !videoMetadata) {
            logger.log('err', 'youtube-handler can\'t fetch a video metadata from a playlist in the fetchHandler');
            logError(err);
          } else {
            tracks.push(mapVideoTrack(videoMetadata, message));
          }
        }
      }
    }
  } else {
    const [err, videoSearchResults] = await to(api.searchVideo(query));

    if (err || !videoSearchResults) {
      logger.log('error', `youtube-handler can\'t fetch videos from a search query: ${query}`);
      logError(err);
    } else if (videoSearchResults) {
      const firstVideosResults = videoSearchResults.items.slice(0, 3);

      for (const video of firstVideosResults) {
        const [videoErr, videoMetadata] = await to(YTDL.getBasicInfo(video.id.videoId));

        if (videoErr || !videoMetadata) {
          logger.log(
            'error',
            'youtube-handler can\'t fetch a video metadata from a list of search videos response',
          );
          logError(err);
        } else {
          tracks.push(mapVideoTrack(videoMetadata, message));
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
export function getReadableStream(track: models.Track): Readable {
  return YTDL(track.streamURL, {
    filter: 'audioonly',
    highWaterMark: 1 << 25,
  })
    .on('error', (err) => {
      logger.log('error', 'youtube-handler YTDL error from getReadableStream');
      logError(err);
    });
}

/**
 * Build a YouTube video URL from a video ID.
 *
 * @param id id of the YouTube video
 */
function buildURLFromID(id: string): string {
  return `https://youtube.com/watch?v=${id}`;
}

/**
 * Map the video metadata fetched from YTDL to a `Track` object.
 *
 * @param video metadata of the video retrieved
 * @param message initiator of the track
 */
function mapVideoTrack(video: YTDL.videoInfo, message: Discord.Message): models.Track {
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
 * Extract the playlist ID from a YouTube playlist URL by seaching for the
 * `list` URL parameter.
 *
 * @param url url of a YouTube playlist
 */
function getPlaylistID(url: string) {
  return new URL(url).searchParams.get('list');
}
