import to from 'await-to-js';

import { Command, providers as Providers } from '../models';
import * as emojis from '../emojis';
import * as providers from '../providers';
import * as player from '../player';
import * as utils from '../utils';

const providersList = utils.providersList();

module.exports = {
  name: 'play',
  description: 'play a track based on a URL (YouTube, SoundCloud) or on a search query (will search on YouTube)',
  execute: async (message, args) => {
    const client = message.client;
    const member = message.member;

    const query = args.join(' ');
    const isURL = utils.isURL(query);
    /** If the query is a search-query, it is a YouTube provider by default */
    const provider = (!isURL) ? 'youtube' : utils.detectURLProvider(query);

    /** If the bot doesn't have the `CONNECT` permission on this guild */
    if (!member.permissions.has('CONNECT')) {
      return message.channel.send(`I don't have the \`CONNECT\` permission, please create a proper role with this permission and add it to the bot.`);
    }

    /** If the bot doesn't have the `SPEAK` permission on this guild */
    if (!member.permissions.has('SPEAK')) {
      return message.channel.send(`I don't have the \`SPEAK\` permission, please create a proper role with this permission and add it to the bot.`);
    }

    /** If the sender is not in a voice-channel */
    if (!member.voiceChannel || !member.voiceChannelID) {
      return message.reply(`you are not connected to a voice-channel. You need to join a voice-channel first, then send a command to call me.`);
    }

    /** If provider unefined, it means the provider is not supported */
    if (!provider) {
      return message.channel.send(`Sorry I don\'t support this provider/service. Here is a list of the supported providers: \`${providersList.join(', ')}\``);
    }

    /** If we try to make a youtube search with a query too short */
    if (provider === 'youtube' && query.length < 3) {
      return message.channel.send('The search query is too short, put at least 3 characters.');
    }

    const emojiProvider = _getEmojiForProvider(provider);

    message.channel.send(`${emojiProvider} searching on **${provider}**: \`${query}\``);

    /** If the sender is in a voice-channel and the bot is not, join voice-channel */
    if (member.voiceChannelID && !client.voiceConnections.has(message.guild.id)) {
      const [joinErr, voiceConnection] = await to(member.voiceChannel.join());

      if (joinErr || !voiceConnection) {
        return message.reply('I am unable to join your voice-channel. Make sure I have enough permissions (connect and speak).');
      }
    }

    /** If the sender and the bot are already in a voice-channel */
    if (message.member.voiceChannelID && client.voiceConnections.has(message.guild.id)) {
      const [fetchTracksErr, tracks] = await to(providers.handleProvider(provider, query, message));
      const isURL = utils.isURL(query);

      if (fetchTracksErr || !tracks || tracks.length <= 0) {
        return client.voiceConnections.get(message.guild.id)!.disconnect();
      }

      /**
       * If it's not an URL we suppose it's a search query, so we need to
       * remove the extra tracks (search up to 3 tracks) before adding them
       * to the queue.
       */
      if (!isURL) {
        tracks.splice(1, tracks.length);
      }

      const guildQueue = player.addTracks(tracks, message);
      player.playTrack(message, guildQueue);
    }
  },
} as Command;

function _getEmojiForProvider(provider: Providers) {
  switch (provider) {
    case 'youtube':
      const youtubeEmoji = emojis.customEmojis.find((emoji) => emoji.name === 'youtube')!;
      return `<:${youtubeEmoji.name}:${youtubeEmoji.id}>`;
      break;

    case 'soundcloud':
      const soundcloudEmoji = emojis.customEmojis.find((emoji) => emoji.name === 'soundcloud')!;
      return `<:${soundcloudEmoji.name}:${soundcloudEmoji.id}>`;
      break;
  }
}
