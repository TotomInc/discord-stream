import Discord from 'discord.js';
import YTDL from 'ytdl-core';
import Debug from 'debug';
import Axios, { AxiosError } from 'axios';
import { URL } from 'url';

import * as models from '../models';

const debug = Debug('streamer:youtube');

/**
 * Fetch and returns a readable stream using YTDL.
 *
 * @param track track metadata
 */
export function getReadableStream(track: models.Track) {
  return YTDL(track.streamURL, { filter: 'audioonly' })
    .on('error', (error) => debug('unexpected error while getting the readable stream: %s', error.message));
}

/**
 * Handler to deterinate if we have a query or a URL, if the URL is a video or
 * a playlist. Delegate the job to other fetch functions.
 *
 * @param url url of the youtube video
 * @param message initiator of the track
 */
export function fetchHandler(url: string, message: Discord.Message): Promise<models.Track[]> {
  if (isPlaylist(url)) {
    return fetchPlaylistVideosMetadata(url, message)
      .then((metadata) => (metadata) ? metadata : []);
  } else if (!isQuery(url)) {
    return fetchVideoMetadata(url, message)
      .then((metadata) => (metadata) ? [metadata] : []);
  } else {
    return fetchSearchVideos(url, message)
      .then((metadata) => (metadata) ? [metadata] : []);
  }
}

/**
 * Try to fetch the metadata of a youtube url and return a `Track` object.
 *
 * @param url url of the youtube video
 * @param message initiator of the track
 */
function fetchVideoMetadata(url: string, message: Discord.Message): Promise<models.Track | void> {
  return YTDL.getBasicInfo(url)
    .then((metadata) => {
      debug('successfully fetched metadata for url: %s', url);
      return mapMetadataToTrack(metadata, message);
    })
    .catch((error: Error) => debug('unable to fetch metadata from a video for url: %s with error: %s', url, error.message));
}

/**
 * Fetch the metadata of all videos in a playlist, return a promise that
 * resolves after each track metadata have been fetched.
 *
 * @param url url of the youtube video
 * @param message initiator of the track
 */
function fetchPlaylistVideosMetadata(url: string, message: Discord.Message) {
  // `fetchHandler` make sure we have a `playlistID`, it can't be null
  const playlistID = findPlaylistID(url) as string;

  return fetchPlaylistMetadata(playlistID)
    .then((playlistMetadata) => {
      const videos = (playlistMetadata)
        ? playlistMetadata.items.map((item) => `https://youtube.com/watch?v=${item.snippet.resourceId.videoId}`)
        : [];

      const fetchVideosPromises = videos.map((video) => fetchVideoMetadata(video, message));

      return Promise.all(fetchVideosPromises);
    })
    .then((videos) => {
      debug('successfully fetched metadata from all videos in the playlist with playlistID: %s', playlistID);
      return videos.filter((video) => !!video) as models.Track[];
    })
    .catch((error: Error) => debug('unable to fetch metadata of all videos from a playlist: %s with playlistID: %s', error.message, playlistID));
}

/**
 * Fetch the metadata of a playlist which identify what videos are in the
 * playlist. Returns the raw data from the YouTube API.
 *
 * @param playlistID ID of the playlist
 */
function fetchPlaylistMetadata(playlistID: string): Promise<models.YoutubePlaylistItems | void> {
  return Axios.get<models.YoutubePlaylistItems>('https://www.googleapis.com/youtube/v3/playlistItems', {
    params: {
      playlistId: playlistID,
      maxResults: 50,
      part: 'snippet',
      key: process.env['YOUTUBE_TOKEN'],
    },
  })
    .then((response) => {
      debug('successfully fetched metadata from a playlist with playlistID: %s', playlistID);
      return response.data;
    })
    .catch((error: AxiosError | string) => {
      debug('unable to fetch metadata of a playlist: %s using YOUTUBE_TOKEN %S', (error instanceof Error) ? error.message : error, process.env['YOUTUBE_TOKEN']);
    });
}

function fetchSearchVideos(query: string, message: Discord.Message) {
  return fetchSearchResult(query)
    .then((searchResult) => {
      const firstVideoID = (searchResult)
        ? searchResult.items[0].id.videoId
        : 'unknown';

      const videoURL = `https://youtube.com/watch?v=${firstVideoID}`;

      return fetchVideoMetadata(videoURL, message);
    })
    .catch((error: Error) => debug('unable to fetch metatada of a video from a search query: %s with search query: %s', error.message, query));
}

function fetchSearchResult(query: string) {
  return Axios.get<models.YoutubeSearchListResponse>('https://www.googleapis.com/youtube/v3/search', {
    params: {
      q: query,
      type: 'video',
      part: 'snippet',
      key: process.env['YOUTUBE_TOKEN'],
    },
  })
    .then((response) => {
      debug('successfully fetched tracks from a search query: %s', query);
      return response.data;
    })
    .catch((error: AxiosError | string) => {
      debug('unable to fetch tracks from a search query: %s using YOUTUBE_TOKEN %S', (error instanceof Error) ? error.message : error, process.env['YOUTUBE_TOKEN']);
    });
}

/**
 * Map the response from `ytdl.videoInfo` to a more readable and lighter
 * `Track` object, made to be consistent across the app.
 *
 * @param metadata metadata of the video retrieved using ytdl-core
 * @param message initiator of the track
 */
function mapMetadataToTrack(metadata: YTDL.videoInfo, message: Discord.Message): models.Track {
  return {
    provider: 'youtube',
    url: metadata.video_url,
    streamURL: metadata.video_url,
    title: metadata.title,
    description: metadata.description,
    views: metadata.view_count,
    thumbnailURL: metadata.thumbnail_url,
    duration: metadata.length_seconds,
    initiator: message,
  };
}

/**
 * Determinate if an URL is a youtube playlist by checking the presence of the
 * `list` URL parameter.
 *
 * @param url url of the track or playlist
 */
function isPlaylist(url: string) {
  return url.indexOf('list=') > -1;
}

/**
 * Determinate if we have a query or a URL by checking if the string
 * `startsWith('http')`.
 *
 * @param query a potential query or URL
 */
function isQuery(query: string) {
  return !query.startsWith('http');
}

/**
 * Find the playlist ID of a URL by searching on the URL the `list` param.
 *
 * @param url url of the playlist
 */
function findPlaylistID(url: string) {
  return new URL(url).searchParams.get('list');
}
