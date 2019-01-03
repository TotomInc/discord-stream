import Discord from 'discord.js';
import to from 'await-to-js';

import * as utils from '../../utils';
import * as models from '../../models';
import * as SoundcloudGuard from './soundcloud.guard';
import SoundcloudAPI from './soundcloud.api';

const api = new SoundcloudAPI();
const key = process.env['SOUNDCLOUD_TOKEN'];

/**
 * Call the right method to fetch metadata of track(s) depending on the query
 * type. Returns an array of potential tracks to be queued.
 *
 * @param query an url to resolve or a search query
 * @param message the discord message that initiated this
 */
export async function fetchHandler(query: string, message: Discord.Message): Promise<models.Track[]> {
  const tracks: models.Track[] = [];
  const isURL = utils.isURL(query);

  if (isURL) {
    const [err, resource] = await to(api.resolveURL(query));

    if (err || !resource) {
      // TODO: something went wrong while trying to resolve the URL
    }
    else if (resource && SoundcloudGuard.isTrack(resource)) {
      tracks.push(_mapSoundcloudTrack(resource, message));
    } else if (resource && SoundcloudGuard.isPlaylist(resource)) {
      resource.tracks
        .map((track) => _mapSoundcloudTrack(track, message))
        .forEach((track) => tracks.push(track));
    }
  } else {
    const [err, trackSearchResults] = await to(api.searchTrack(query));

    if (err || !trackSearchResults) {
      // TODO: something went wrong while trying to search a track
    } else if (trackSearchResults) {
      trackSearchResults
        .slice(0, 3)
        .map((track) => _mapSoundcloudTrack(track, message))
        .forEach((track) => tracks.push(track));
    }
  }

  return tracks;
}

/**
 * Returns an URL which, when resolved, lead to a readable stream.
 *
 * @param track the track object containing metadata
 */
export function getReadableStreamURL(track: models.Track): string {
  return `${track.streamURL}?client_id=${key}`;
}

/**
 * Map the raw track metadata from SoundCloud API to `Track` object.
 *
 * @param track raw track metadata
 * @param message the discord message that initiated this
 */
function _mapSoundcloudTrack(track: models.SoundcloudTrack, message: Discord.Message): models.Track {
  return {
    provider: 'soundcloud',
    url: track.permalink_url,
    streamURL: track.stream_url,
    title: track.title,
    description: track.description,
    views: track.playback_count.toString(),
    thumbnailURL: track.artwork_url,
    duration: (track.duration / 1000).toString(),
    initiator: message,
  }
}
