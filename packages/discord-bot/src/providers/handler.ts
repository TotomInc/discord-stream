import Discord from 'discord.js';
import to from 'await-to-js';

import * as models from '../models';
import * as youtube from './youtube';
import * as soundcloud from './soundcloud';

/**
 * Fetch metadata from the user input. Returns a promise with an array of
 * `Track`.
 *
 * @param provider provider of the url
 * @param query the query could be an url or a search query
 * @param message the discord message that initiated this
 */
export async function handleProvider(
  provider: models.providers,
  query: string,
  message: Discord.Message,
): Promise<models.Track[]> {
  const [err, tracks] = await to<models.Track[]>(_fetchMetadata(provider, query, message));

  if (err || !tracks || tracks.length <= 0) {
    message.channel.send(`Your track haven't been queued, there was an unexpected error. Please try again or something else.`);
  }

  return tracks || [];
}

/**
 * Call the right method to get the readable stream from the track URL.
 *
 * @param provider provider of the url
 * @param track track object
 */
export function handleStreamProvider(provider: models.providers, track: models.Track): models.StreamProvider {
  switch (provider) {
    case 'youtube':
      return {
        stream: youtube.getReadableStream(track),
      };
      break;

    case 'soundcloud':
      return {
        arbitraryURL: `${track.streamURL}?client_id=${process.env['SOUNDCLOUD_TOKEN']}`,
      };
      break;
  }
}

/**
 * Call the right method to fetch track/playlist metadata depending of the
 * provider. This allow us to use the right API for each provider.
 *
 * @param provider provider of the url
 * @param query the query could be an url or a search query
 * @param message the discord message that initiated this
 */
async function _fetchMetadata(
  provider: models.providers,
  query: string,
  message: Discord.Message,
): Promise<models.Track[]> {
  switch (provider) {
    case 'youtube':
      return youtube.fetchHandler(query, message);
      break;

    case 'soundcloud':
      return soundcloud.fetchHandler(query, message);
      break;
  }
}
