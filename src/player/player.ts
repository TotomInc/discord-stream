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
  const track = tracks.shift();

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

  return guildVoiceConnection.playStream(stream)
    .on('error', (error) => debug('unexpected error while trying to play a track: %s', error.message))
    .on('start', () => debug('started audio stream for guildID: %s', guildID))
    .on('end', (reason) => {
      const guildQueue = queue.removeFirstTrack(track.initiator);

      // The `end` event is emitted 2 times from the `stopTrack` function, we
      // filter the skip reason so we don't remove 2 tracks instead of 1.
      if (reason === 'skip') {
        return;
      }

      debug('track ended for guild: %s, queue state after removing the played track: %s', guildID, guildQueue.length);

      if (guildQueue.length > 0) {
        playTrack(track.initiator, guildQueue);
        debug('playing the next track for guild: %s', guildID);
      } else {
        guildVoiceConnection.channel.leave();
        debug('left the voice-channel for guild: %s since there are no more tracks to play', guildID);
      }
    });
}

/**
 * Find the current voice-connection for the guild where the message have been
 * sent then we can end the dispatcher prematurely by sending a `end` event
 * with a `'skip'` reason (the reason is very important in this case).
 *
 * @param message the discord message that initiated the `stopTrack`
 */
export function stopTrack(message: Discord.Message) {
  const client = message.client;
  const guildID = message.guild.id;
  const guildVoiceConnection = client.voiceConnections.get(guildID);

  if (guildVoiceConnection && guildVoiceConnection.speaking) {
    // This will emit 2 times the `end` event, so we need to pass a reason to
    // filter this event emitted.
    guildVoiceConnection.dispatcher.end('skip');
  } else {
    message.channel.send('Unable to skip the track, make sure the bot is playing');
  }
}
