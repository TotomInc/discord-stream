import Axios, { AxiosError } from 'axios';
import Discord from 'discord.js';

import * as models from '../models';
import * as utils from '../utils';

export function fetchHandler(query: string, message: Discord.Message): Promise<models.Track[]> {
  /** If query is an URL, try to determine what type of SoundCloud URL */
  if (utils.isURL(query)) {
    return _resolveURL(query)
      .then((response) => {
        if (!response) {
          return [];
        } else if (_isTrackURL(response)) {
          return [_mapTrackToTrack(response, message)];
        } else if (_isPlaylistURL(response)) {
          return response.tracks.map((track) => _mapTrackToTrack(track, message));
        }

        return [];
      });
  }
  /** The query is a search query, execute a search on SoundCloud */
  else {
    return _fetchSearchTrack(query)
      .then((response) => {
        if (!response || response.length <= 0) {
          return [];
        }

        const firstElements = response
          .filter((el) => el.kind === 'track')
          .slice(0, 3);

        return (firstElements as models.SoundcloudTrack[])
          .map((el) => _mapTrackToTrack(el, message));
      });
  }
}

/**
 * Resolve a soundcloud URL, we expect a response which contains the `kind` of
 * the resource fetched.
 *
 * @param url a soundcloud url that we need to resolve
 */
function _resolveURL(url: string) {
  return Axios.get<models.SoundcloudResponse>(`http://api.soundcloud.com/resolve.json`, {
    params: {
      url,
      client_id: process.env['SOUNDCLOUD_TOKEN'],
    },
  })
    .then((response) => response.data)
    .catch((error: AxiosError | string) => {});
}

/**
 * Execute a search on SoundCloud which returns an array of mixed `kind`.
 *
 * @param query the search query
 */
function _fetchSearchTrack(query: string) {
  return Axios.get<models.SoundcloudResponse[]>(`http://api.soundcloud.com/tracks`, {
    params: {
      q: query,
      client_id: process.env['SOUNDCLOUD_TOKEN'],
    },
  })
    .then((response) => response.data)
    .catch((error: AxiosError | string) => {});
}

/**
 * Type-guard for checking a `SoundcloudPlaylist`. We can check it by verifying
 * the kind of the resource which should be `playlist`.
 *
 * @param data response to check for a `SoundcloudPlaylist`.
 */
function _isPlaylistURL(data: any): data is models.SoundcloudPlaylist {
  return data.kind === 'playlist';
}

/**
 * Type-guard for checking a `SoundcloudTrack`. We can check it by verifying
 * the kind of the resource which should be `track`.
 *
 * @param data response to check for a `SoundcloudTrack`.
 */
function _isTrackURL(data: models.SoundcloudResponse): data is models.SoundcloudTrack {
  return data.kind === 'track';
}

/**
 * Map the raw track metadata from Soundcloud API to a consistent object to be
 * used across all the app.
 *
 * @param track track metadata.
 * @param message the discord message this whole thing.
 */
function _mapTrackToTrack(track: models.SoundcloudTrack, message: Discord.Message): models.Track {
  return {
    provider: 'soundcloud',
    url: track.permalink_url,
    streamURL: track.stream_url,
    title: track.title,
    description: track.description,
    views: track.playback_count.toString(),
    thumbnailURL: track.artwork_url,
    // Track duration from Soundcloud API is in milliseconds
    duration: (track.duration / 1000).toString(),
    initiator: message,
  }
}
