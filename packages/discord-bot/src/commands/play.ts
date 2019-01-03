import Debug from 'debug';
import to from 'await-to-js';

import { Command } from '../models';
import * as providers from '../providers';
import * as player from '../player';
import * as utils from '../utils';

const debug = Debug('streamer:play');
const providersList = utils.providersList();

module.exports = {
  name: 'play',
  description: 'play a track based on a URL (YouTube, SoundCloud) or on a search query (will search on YouTube)',
  execute: async (message, args) => {
    const client = message.client;
    const member = message.member;

    const query = args.join(' ');
    const provider = (!utils.isURL(query))
      ? 'youtube'
      : utils.detectURLProvider(query);

    /** If provider unefined, it means the provider is not supported */
    if (!provider) {
      return message.channel.send(`Sorry I don\'t support this provider. Here is a list of the supported providers: ${providersList.join(', ')}`);
    }

    /** If we try to make a youtube search with a query too short */
    if (provider === 'youtube' && query.length < 3) {
      return message.channel.send('The search query is too short.');
    }

    message.channel.send(`:mag_right: Searching on **${provider}**: \`${query}\``);

    if (member.voiceChannelID && !client.voiceConnections.has(message.guild.id)) {
      const [joinErr, voiceConnection] = await to(member.voiceChannel.join());

      if (joinErr || !voiceConnection) {
        return message.reply('I am unable to join your voice-channel. Make sure I have enough permissions.');
      }
    }

    if (message.member.voiceChannelID && client.voiceConnections.has(message.guild.id)) {
      const [fetchTracksErr, tracks] = await to(providers.handleProvider(provider, query, message));

      if (fetchTracksErr || !tracks || tracks.length <= 0) {
        return client.voiceConnections.get(message.guild.id)!.disconnect();
      }

      const guildQueue = player.addTracks(message, tracks);
      player.playTrack(message, guildQueue);
    }
  },
} as Command;
