import Discord from 'discord.js';
import Debug from 'debug';

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
 * Fetch metadata from a track/playlist and send a rich-embed message.
 * Returns a promise with an array of `Track`.
 *
 * @param provider provider of the url
 * @param query the query could be an url or a search query
 * @param message the discord message that initiated this
 */
export function handleProvider(provider: models.providers, query: string, message: Discord.Message): Promise<void | models.Track[]> {
  return _switchFetchMetadataProvider(provider, query, message)
    .then((response) => {
      // This means we haven't found any track
      if (response.length <= 0) {
        message.channel.send('Your track haven\'t been queued, there was an unexpected error, try again or something else');
        debug('promise resolved but no track added with query: %s with provider %s', query, provider);
      }

      // This means we have a single-track
      if (response.length === 1) {
        const track = response[0];

        // For some weird reasons, discord.js add a strange symbol with interpolated strings
        const richEmbed = utils.generateRichEmbed('Queued a new track', message.client)
          .addField(track.title, _formatTrackAddedMessage(track.duration, track.initiator))
          .setThumbnail(track.thumbnailURL)
          .setURL(track.url);

        debug('handled a single track from provider: %s with query/url: %s', provider, track.url);
        message.channel.send(richEmbed);
      }

      // This means we are trying to import a playlist
      if (response.length > 1) {
        const richEmbed = utils.generateRichEmbed('Queued a new playlist', message.client)
          .setDescription(`Added ${response.length} tracks into the queue`);

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
function _switchFetchMetadataProvider(provider: models.providers, query: string, message: Discord.Message): Promise<models.Track[]> {
  switch (provider) {
    case 'youtube':
      return youtube.fetchHandler(query, message);
      break;

    case 'soundcloud':
      return soundcloud.fetchHandler(query, message);
      break;
  }
}

/**
 * Returns the track-added message to be used in a rich-embed. This function
 * doesn't use ES6 template strings because of an incompatibility with
 * `discord.js` where it adds a strange symbol on the string.
 *
 * @param duration duration of the track in ms
 * @param message the discord message that initiated this
 */
function _formatTrackAddedMessage(duration: string, message: Discord.Message): string {
  const formattedTime = utils.secondsToHHMMSS(duration);

  return formattedTime + ' - Added by ' + message.author.username;
}
