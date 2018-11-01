import Axios, { AxiosError } from 'axios';
import Discord from 'discord.js';
import Debug from 'debug';

import * as models from '../models';

const debug = Debug('streamer:soundcloud');

export function fetchHandler(query: string, message: Discord.Message): Promise<models.Track[]> {
  return resolveURL(query)
    .then((response) => {
      if (!response) {
        debug('response is empty, the url may not have been resolved');
        return [];
      } else if (isTrackURL(response)) {
        return [mapTrackToTrack(response, message)];
      } else if (isPlaylistURL(response)) {
        return response.tracks.map((track) => mapTrackToTrack(track, message));
      }

      // debug('the url have been resolved but the response didn\'t matched any criteria to map-track: %O', response);
      return [];
    });
}

/**
 * Resolve a soundcloud URL, we expect a response which contains the `kind` of
 * the resource fetched. We also expect to fetch nothing/an error.
 *
 * @param url a soundcloud url that we need to resolve
 */
function resolveURL(url: string) {
  return Axios.get<models.SoundcloudResponse>(`http://api.soundcloud.com/resolve.json`, {
    params: {
      url,
      client_id: process.env['SOUNDCLOUD_TOKEN'],
    },
  })
    .then((response) => {
      debug('successfully resolved url: %s of kind: %s', url, response.data.kind);
      return response.data;
    })
    .catch((error: AxiosError | string) => {
      debug('unable to fetch metadata of a url: %s using SOUNDCLOUD_TOKEN %S', (error instanceof Error) ? error.message : error, process.env['SOUNDCLOUD_TOKEN']);
    });
}

/**
 * Type-guard for checking a `SoundcloudPlaylist`. We can check it by verifying
 * the kind of the resource which should be `playlist`.
 *
 * @param data response to check for a `SoundcloudPlaylist`.
 */
function isPlaylistURL(data: any): data is models.SoundcloudPlaylist {
  return data.kind === 'playlist';
}

/**
 * Type-guard for checking a `SoundcloudTrack`. We can check it by verifying
 * the kind of the resource which should be `track`.
 *
 * @param data response to check for a `SoundcloudTrack`.
 */
function isTrackURL(data: models.SoundcloudResponse): data is models.SoundcloudTrack {
  return data.kind === 'track';
}

/**
 * Map the raw track metadata from Soundcloud API to a consistent object to be
 * used across all the app.
 *
 * @param track track metadata.
 * @param message the discord message this whole thing.
 */
function mapTrackToTrack(track: models.SoundcloudTrack, message: Discord.Message): models.Track {
  return {
    provider: 'soundcloud',
    url: track.permalink_url,
    streamURL: track.stream_url,
    title: track.title,
    description: track.description,
    views: track.playback_count.toString(),
    thumbnailURL: track.artwork_url,
    duration: track.duration.toString(),
    initiator: message,
  }
}
