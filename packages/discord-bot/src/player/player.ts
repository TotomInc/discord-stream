import * as Discord from 'discord.js';

import * as models from '../models';
import * as providers from '../providers';
import * as queue from './queue';
import { LoggerService } from '../services/logger.service';

const loggerService = new LoggerService();

const streamOptions: Discord.StreamOptions = {
  passes: 3,
  bitrate: 'auto',
};

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

  if (!guildVoiceConnection || guildVoiceConnection.speaking || !tracks || tracks.length <= 0) {
    return;
  }

  const track = tracks[0];
  const stream = providers.handleStreamProvider(track.provider, track);

  if (stream.stream) {
    playReadableStream(guildVoiceConnection, message, stream);
  } else if (stream.arbitraryURL && !stream.stream) {
    playArbitraryInput(guildVoiceConnection, message, stream);
  }
}

/**
 * Find the current voice-connection for the guild where the message have been
 * sent then we can end the dispatcher prematurely by sending an `end` event.
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
    message.channel.send('Unable to skip the track, make sure the bot is playing something.');
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

  if (guildVoiceConnection) {
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
  }

  if (guildVoiceConnection && !guildVoiceConnection.speaking) {
    message.reply('I am not speaking.');
    return false;
  }

  guildVoiceConnection.dispatcher.setVolume(volume / 100);

  return true;
}

/**
 * Play a readable stream.
 *
 * @param guildVoiceConnection the guild-voice connection
 * @param message the message that initiated this
 * @param stream the stream-provider object to determine nature of the resource
 */
function playReadableStream(
  guildVoiceConnection: Discord.VoiceConnection,
  message: Discord.Message,
  stream: models.StreamProvider,
): Discord.StreamDispatcher {
  return guildVoiceConnection.playStream(stream.stream!, streamOptions)
    .on('error', err => loggerService.log.error(err))
    .on('end', reason => onTrackEnd(reason, message));
}

/**
 * Play an arbitrary input (URLs).
 *
 * @param guildVoiceConnection the guild-voice connection
 * @param message the message that initiated this
 * @param stream the stream-provider object to determine nature of the resource
 */
function playArbitraryInput(
  guildVoiceConnection: Discord.VoiceConnection,
  message: Discord.Message,
  stream: models.StreamProvider,
): Discord.StreamDispatcher {
  return guildVoiceConnection.playArbitraryInput(stream.arbitraryURL!, streamOptions)
    .on('error', err => loggerService.log.error(err))
    .on('end', reason => onTrackEnd(reason, message));
}

/**
 * Function executed when the `on#end` event have been called from a
 * `Discord#StreamDispatched`.
 *
 * @param reason the reason of the `on#end` event that triggered this function
 * @param message the discord message that iniated the track
 */
function onTrackEnd(reason: string, message: Discord.Message): void {
  const guildVoiceConnection = message.client.voiceConnections.get(message.guild.id);
  const guildQueue = queue.removeFirstTrack(message);

  if (guildQueue.length > 0) {
    playTrack(guildQueue[0].initiator, guildQueue);
  } else if (guildVoiceConnection) {
    guildVoiceConnection.channel.leave();
  }
}
