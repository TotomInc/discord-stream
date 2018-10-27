import Debug from 'debug';

import { Command } from '../models';
import * as providers from '../providers';
import * as player from '../player';
import * as utils from '../utils';

const debug = Debug('streamer:play');

module.exports = {
  name: 'play',
  description: 'play a track based on a URL (YouTube, SoundCloud, radio-stream, ...) or search query (will search on YouTube)',
  execute: (message, args) => {
    const client = message.client;
    const member = message.member;
    const query = args.join(' ');

    const provider = (!utils.isURL(query))
      ? 'youtube'
      : utils.detectURLProvider(query);

    /** If provider is not supported */
    if (!provider) {
      return message.channel.send('Sorry I don\'t support this provider');
    }

    message.channel.send(`:mag_right: Searching on **${provider}**: \`${query}\``);

    /** If author is in a voice-channel and bot is not */
    if (member.voiceChannelID && !client.voiceConnections.has(message.guild.id)) {
      member.voiceChannel.join()
        .catch((err: Error) => {
          debug('unable to join voice-channel %s on guild %s', message.member.voiceChannelID, message.guild.id);
          message.reply('looks like there is an unexpected error, I can\'t join your voice-channel, please try again');
        })
        .then(() => providers.handleProvider(provider, query, message))
        .then((tracks) => player.addTracks(message, tracks || []))
        .then((queue) => player.playTrack(message, queue));
    }
    /** If author is in the same voice-channel of the bot */
    else if (message.member.voiceChannelID && client.voiceConnections.has(message.guild.id)) {
      providers.handleProvider(provider, query, message)
        .then((tracks) => player.addTracks(message, tracks || []))
        .then((queue) => player.playTrack(message, queue));
    } else {
      message.reply('make sure you join a voice-channel or the same voice-channel of the bot if he is connected');
    }
  },
} as Command;
