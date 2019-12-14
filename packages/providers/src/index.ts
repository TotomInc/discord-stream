import dotenv from 'dotenv';

// Make sure to load dotenv first
dotenv.config({
  path: require('find-config')('.env'),
});

import { Stream, StreamProviders } from '@discord-stream/models';
import Discord from 'discord.js';
import to from 'await-to-js';

import YoutubeHandler from './handlers/youtube.handler';
import SoundcloudHandler from './handlers/souncloud.handler';

const handlers = {
  youtube: new YoutubeHandler(),
  soundcloud: new SoundcloudHandler(),
};

/**
 * Fetch metadata from the user input. Returns a promise with an array of
 * `Track`.
 *
 * @param provider the service-provider of the resource
 * @param query the url or search query
 * @param message the discord message that initiated this
 */
export async function handleProvider(provider: StreamProviders.IProviders, query: string, message: Discord.Message): Promise<Stream.ITrack[]> {
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
export function handleStreamProvider(provider: StreamProviders.IProviders, track: Stream.ITrack): StreamProviders.IStreamableTrackData {
  switch (provider) {
    case 'youtube':
      return {
        stream: handlers.youtube.getReadableStream(track),
      };

    case 'soundcloud':
      return {
        arbitraryURL: handlers.soundcloud.getReadableStream(track),
      };
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
async function fetchMetadata(provider: StreamProviders.IProviders, query: string, message: Discord.Message): Promise<Stream.ITrack[]> {
  switch (provider) {
    case 'youtube':
      return handlers.youtube.fetchTrack(query, message);

    case 'soundcloud':
      return handlers.soundcloud.fetchTrack(query, message);
  }
}
