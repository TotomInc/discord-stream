import { Readable } from 'stream';
import { URL } from 'url';
import Discord from 'discord.js';
import YTDL from 'ytdl-core';
import to from 'await-to-js';

import * as utils from '../../utils';
import * as models from '../../models';
import * as YoutubeGuard from './youtube.guard';
import YoutubeAPI from './youtube.api';
import { logError } from '../../logger';

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
  const isURL = utils.isURL(query);
  const isVideo = (isURL) ? YoutubeGuard.isVideo(query) : false;
  const isPlaylist = (isURL) ? YoutubeGuard.isPlaylist(query) : false;

  if (isURL) {
    if (isVideo && !isPlaylist) {
      const [err, videoMetadata] = await to(api.getVideo(query));

      if (err || !videoMetadata) {
        // TODO: something went wrong while trying to get video metadata
      } else {
        tracks.push(_mapVideoTrack(videoMetadata, message));
      }
    } else if (isPlaylist) {
      const playlistID = _getPlaylistID(query)!;
      const [err, playlistMetadata] = await to(api.getPlaylist(playlistID));

      if (err || !playlistMetadata) {
        // TODO: something went wrong while trying to fetch playlist metadata
      } else {
        const playlistVideoIDs = playlistMetadata.items.map((item) => item.snippet.resourceId.videoId);

        for (const videoID of playlistVideoIDs) {
          const [videoErr, videoMetadata] = await to(api.getVideo(_buildURLFromID(videoID)));

          if (videoErr || !videoMetadata) {
            // TODO: something went wrong while trying to fetch metadata from a video in a playlist
          } else {
            tracks.push(_mapVideoTrack(videoMetadata, message));
          }
        }
      }
    }
  } else {
    const [err, videoSearchResults] = await to(api.searchVideo(query));

    if (err || !videoSearchResults) {
      // TODO: something went wrong while tyring to search videos
    } else if (videoSearchResults) {
      const firstVideosResults = videoSearchResults.items.slice(0, 3);

      for (const video of firstVideosResults) {
        const [videoErr, videoMetadata] = await to(YTDL.getBasicInfo(video.id.videoId));

        if (videoErr || !videoMetadata) {
          // TODO: something went wrong while trying to fetch metadata from the first videos results
        } else {
          tracks.push(_mapVideoTrack(videoMetadata, message));
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
  })
    .on('error', (err) => logError(err));
}

/**
 * Build a YouTube video URL from a video ID.
 *
 * @param id id of the YouTube video
 */
function _buildURLFromID(id: string): string {
  return `https://youtube.com/watch?v=${id}`;
}

/**
 * Map the video metadata fetched from YTDL to a `Track` object.
 *
 * @param video metadata of the video retrieved
 * @param message initiator of the track
 */
function _mapVideoTrack(video: YTDL.videoInfo, message: Discord.Message): models.Track {
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
function _getPlaylistID(url: string) {
  return new URL(url).searchParams.get('list');
}
