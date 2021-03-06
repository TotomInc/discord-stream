import Discord from 'discord.js';
import to from 'await-to-js';

import * as models from '../../models';
import * as SoundcloudGuard from './soundcloud.guard';
import { config } from '../../config/env';
import { isURL } from '../../utils/url';
import { LoggerService } from '../../services/logger.service';
import SoundcloudAPI from './soundcloud.api';

const loggerService = new LoggerService();
const api = new SoundcloudAPI();

/**
 * Call the right method to fetch metadata of track(s) depending on the query
 * type. Returns an array of potential tracks to be queued.
 *
 * @param query an url to resolve or a search query
 * @param message the discord message that initiated this
 */
export async function fetchHandler(query: string, message: Discord.Message): Promise<models.Track[]> {
  const tracks: models.Track[] = [];
  const isValidURL = isURL(query);

  if (isValidURL) {
    const [err, resource] = await to(api.resolveURL(query));

    if (!err && resource && SoundcloudGuard.isTrack(resource)) {
      tracks.push(mapSoundcloudTrack(resource, message));
    } else if (!err && resource && SoundcloudGuard.isPlaylist(resource)) {
      resource.tracks
        .map(track => mapSoundcloudTrack(track, message))
        .forEach(track => tracks.push(track));
    }
  } else {
    const [err, trackSearchResults] = await to(api.searchTrack(query));

    if (!err && trackSearchResults) {
      trackSearchResults.slice(0, 3)
        .map(track => mapSoundcloudTrack(track, message))
        .forEach(track => tracks.push(track));
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
  return `${track.streamURL}?client_id=${config.tokens.soundcloud}`;
}

/**
 * Map the raw track metadata from SoundCloud API to `Track` object.
 *
 * @param track raw track metadata
 * @param message the discord message that initiated this
 */
function mapSoundcloudTrack(track: models.SoundcloudTrack, message: Discord.Message): models.Track {
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
  };
}
