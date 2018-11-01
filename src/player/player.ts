import * as Discord from 'discord.js';
import Debug from 'debug';

import * as models from '../models';
import * as providers from '../providers';
import * as queue from './queue';

const debug = Debug('streamer:player');

/**
 * Try to play a track for the current voice-connection of the `guildID` from
 * the message. Can't play a track if we don't have a voice-connection or if
 * bot is speaking.
 *
 * Then fetch the right `Readable` stream according to the provider to dispatch
 * it for the `voiceConnection.playStream(stream)`.
 *
 * @param message the discord message that initiated the play
 * @param tracks an array of `Track` to play
 */
export function playTrack(message: Discord.Message, tracks: models.Track[]) {
  const client = message.client;
  const guildID = message.guild.id;
  const guildVoiceConnection = client.voiceConnections.get(guildID);
  const track: models.Track | undefined = tracks[0];

  if (!guildVoiceConnection) {
    debug('unexpected error, there is no voice-connection for the guildID: %s but it was supposed to have one', guildID);
    return;
  }

  if (guildVoiceConnection.speaking) {
    debug('cannot play a track because the bot is actually speaking for guildID: %s', guildID);
    return;
  }

  if (!track) {
    debug('unexpected error, there is no track to stream for the guildID: %s with a queue: %O', guildID, tracks);
    return;
  }

  const stream = providers.handleStreamProvider(track.provider, track);

  if (stream.stream && !stream.arbitraryURL) {
    return guildVoiceConnection.playStream(stream.stream)
      .on('error', (error) => debug('unexpected error while trying to play a track: %s', error.message))
      .on('start', () => debug('started audio stream for guildID: %s', guildID))
      .on('end', (reason) => {
        const guildQueue = queue.removeFirstTrack(message);

        if (guildQueue.length > 0) {
          playTrack(guildQueue[0].initiator, guildQueue);
        } else {
          guildVoiceConnection.channel.leave();
        }
      });
  } else if (stream.arbitraryURL && !stream.stream) {
    return guildVoiceConnection.playArbitraryInput(stream.arbitraryURL)
      .on('error', (error) => debug('unexpected error while trying to play a track: %s', error.message))
      .on('start', () => debug('started audio stream for guildID: %s', guildID))
      .on('end', (reason) => {
        const guildQueue = queue.removeFirstTrack(message);

        if (guildQueue.length > 0) {
          playTrack(guildQueue[0].initiator, guildQueue);
        } else {
          guildVoiceConnection.channel.leave();
        }
      });
  }
}

/**
 * Find the current voice-connection for the guild where the message have been
 * sent then we can end the dispatcher prematurely by sending a `end` event.
 *
 * @param message the discord message that initiated the `stopTrack`
 */
export function stopTrack(message: Discord.Message) {
  const client = message.client;
  const guildID = message.guild.id;
  const guildVoiceConnection = client.voiceConnections.get(guildID);

  if (guildVoiceConnection && guildVoiceConnection.speaking) {
    guildVoiceConnection.dispatcher.end('skip');
  } else {
    message.channel.send('Unable to skip the track, make sure the bot is playing');
  }
}

/**
 * When calling this function we make sure the bot is safely exiting a voice-
 * channel by removing the `guildQueue` and disconnecting the
 * `voiceConnection`.
 *
 * @param message the discord message that initiated the `cleanPlayer`
 */
export function cleanPlayer(message: Discord.Message) {
  const client = message.client;
  const guildID = message.guild.id;
  const guildVoiceConnection = client.voiceConnections.get(guildID);

  queue.removeQueue(message);

  if (guildVoiceConnection && guildVoiceConnection.speaking) {
    guildVoiceConnection.disconnect();
  }
}

/**
 * Set the volume of the current dispatcher stream, convert the volume to a
 * value between 0 and 1. Returns a boolean if the volume have been correctly
 * edited.
 *
 * @param message the discord message that initiated the `setVolume`
 * @param volume a number between 0 and 100 (in percent)
 */
export function setVolume(message: Discord.Message, volume: number): boolean {
  const guildID = message.guild.id;
  const guildVoiceConnection = message.client.voiceConnections.get(guildID);

  if (!guildVoiceConnection) {
    message.reply('I am not in a voice-channel.');
    return false;
  } else if (guildVoiceConnection && !guildVoiceConnection.speaking) {
    message.reply('I am not speaking.');
    return false;
  } else {
    guildVoiceConnection.dispatcher.setVolume(volume / 100);
    return true;
  }
}
