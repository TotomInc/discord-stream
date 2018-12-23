import Axios, { AxiosError } from 'axios';
import Discord from 'discord.js';

import * as models from '../models';
import * as utils from '../utils';

/**
 * Automatically determine how to fetch the metadata of the query depending on
 * its kind:
 *  - a search-query: automatically trigger a search an returns the first 3
 *  results.
 *  - a soundcloud URL: resolve the soundcloud URL to determine the kind of the
 *  resource (handle tracks and playlists).
 *
 * @param query a query can be an URL to resolve or a search-query
 * @param message the discord message that initiated this
 */
export async function fetchHandler(query: string, message: Discord.Message): Promise<models.Track[]> {
  if (utils.isURL(query)) {
    const resolvedURL = await _resolveURL(query);

    if (!resolvedURL) {
      return [];
    } else if (_isUserKind(resolvedURL)) {
      const userTracks = await _resolveURL(`${resolvedURL.permalink_url}/tracks`) as models.SoundcloudTrack[] | void;

      if (userTracks && Array.isArray(userTracks)) {
        return userTracks.map((track) => _mapTrackToTrack(track, message));
      } else {
        return [];
      }
    } else if (_isTrackKind(resolvedURL)) {
      return [_mapTrackToTrack(resolvedURL, message)];
    } else if (_isPlaylistKind(resolvedURL)) {
      return resolvedURL.tracks.map((track) => _mapTrackToTrack(track, message));
    }

    return [];
  } else {
    const searchResults = await _fetchSearchTrack(query);

    if (!searchResults ||searchResults.length <= 0) {
      return [];
    }

    const firstSearchResults = searchResults
      .filter((el) => el.kind === 'track')
      .slice(0, 3) as models.SoundcloudTrack[];

    return firstSearchResults.map((track) => _mapTrackToTrack(track, message));
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
function _isPlaylistKind(data: any): data is models.SoundcloudPlaylist {
  return data.kind === 'playlist';
}

/**
 * Type-guard for checking a `SoundcloudTrack`. We can check it by verifying
 * the kind of the resource which should be `track`.
 *
 * @param data response to check for a `SoundcloudTrack`.
 */
function _isTrackKind(data: models.SoundcloudResponse): data is models.SoundcloudTrack {
  return data.kind === 'track';
}

/**
 * Type-guard for checking a `SoundcloudUser`. We can check it by verifying
 * the kind of the resource which should be `user`.
 *
 * @param data response to check for a `SoundcloudUser`.
 */
function _isUserKind(data: models.SoundcloudResponse): data is models.SoundcloudUser {
  return data.kind === 'user';
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
