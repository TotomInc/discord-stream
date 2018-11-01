import Discord from 'discord.js';
import Debug from 'debug';
import { Readable } from 'stream';

import * as models from '../models';
import * as utils from '../utils';

import * as youtube from './youtube';
import * as soundcloud from './soundcloud';

const debug = Debug('streamer:handler');

/**
 * Call the right method to get the readable stream from the track URL.
 *
 * @param provider provider of the url
 * @param track track object
 */
export function handleStreamProvider(provider: models.providers, track: models.Track): { stream?: Readable, arbitraryURL?: string } {
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
 * Fetch metadata from a track/playlist and send a rich-embed message.
 * Returns a promise with an array of `Track`.
 *
 * @param provider provider of the url
 * @param query the query could be an url or a search query
 * @param message the discord message that initiated this
 */
export function handleProvider(provider: models.providers, query: string, message: Discord.Message): Promise<void | models.Track[]> {
  return switchFetchMetadataProvider(provider, query, message)
    .then((response) => {
      if (response.length <= 0) {
        message.channel.send('Your track haven\'t been queued, there was an unexpected error, try again or something else');
        debug('promise resolved but no track added with query: %s with provider %s', query, provider);
      }

      if (response.length === 1) {
        const track = response[0];

        if (!track) {
          debug('was expecting a track at the first position of the array but got nothing: %O', response);
          message.channel.send('There was an unexpected error, please try again or something else');
        } else {
          const richEmbed = utils.generateRichEmbed('Queued a new track', message.client)
            .addField(track.title, `${utils.secondsToHHMMSS(track.duration)} — Added by ${track.initiator.author.username}`)
            .setThumbnail(track.thumbnailURL)
            .setURL(track.url);

          debug('handled a single track from provider: %s with query/url: %s', provider, track.url);
          message.channel.send(richEmbed);
        }
      }

      // This means we are trying to import a playlist, make sure we really
      // want to import it in the queue by creating a reaction collector
      if (response.length > 1) {
        const richEmbed = utils.generateRichEmbed('Queued a new playlist', message.client)
          .addField(`Added ${response.length} tracks into the queue`, 'If this is an error, you clear the queue');

        debug('handled an array of tracks from a playlist form provider: %s', provider);
        message.channel.send(richEmbed);
      }

      return response;
    })
    .catch((err: Error) => {
      debug('unable to fetch metadata for query: %s, error: %O', query, err);
      message.channel.send('Something went wrong while trying to fetch metadata');
    });
}

/**
 * Call the right method to fetch track/playlist metadata depending of the
 * provider. This allow us to use the right API for each provider.
 *
 * @param provider provider of the url
 * @param query the query could be an url or a search query
 * @param message the discord message that initiated this
 */
function switchFetchMetadataProvider(provider: models.providers, query: string, message: Discord.Message): Promise<models.Track[]> {
  switch (provider) {
    case 'youtube':
      return youtube.fetchHandler(query, message);
      break;

    case 'soundcloud':
      return soundcloud.fetchHandler(query, message);
      break;
  }
}
