import Discord from 'discord.js';
import to from 'await-to-js';

import * as models from '../models';
import * as youtube from './youtube';
import * as soundcloud from './soundcloud';

/**
 * Fetch metadata from the user input. Returns a promise with an array of
 * `Track`.
 *
 * @param provider the service-provider of the resource
 * @param query the url or search query
 * @param message the discord message that initiated this
 */
export async function handleProvider(
  provider: models.providers,
  query: string,
  message: Discord.Message,
): Promise<models.Track[]> {
  const [err, tracks] = await to(fetchMetadata(provider, query, message));

  if (err || !tracks || tracks.length <= 0) {
    message.channel.send('Your track haven\'t been queued because the metadata could not be fetched.');
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
        arbitraryURL: soundcloud.getReadableStreamURL(track),
      };
      break;
  }
}

/**
 * Call the right method to fetch track/playlist/search metadata depending of
 * the provider. This allow us to use the right API calls for a specific
 * provider.
 *
 * @param provider the service-provider of the url
 * @param query the search query or an url
 * @param message the discord message that initiated this
 */
async function fetchMetadata(
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
