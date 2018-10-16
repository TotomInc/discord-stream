import Discord from 'discord.js';

import { Command } from '../models';
import * as player from '../player';

module.exports = {
  name: 'leave',
  description: 'leave the voice-channel where the bot is connected',
  execute: (message, args) => {
    const client = message.client;
    const guildID = message.guild.id;
    const authorVoiceChannel: Discord.VoiceChannel | undefined = message.member.voiceChannel;
    const botGuildVoiceConnection = client.voiceConnections.get(guildID);

    if (!botGuildVoiceConnection) {
      message.reply('I am not connected to a voice-channel');
    } else if (!authorVoiceChannel || botGuildVoiceConnection.channel.id !== authorVoiceChannel.id) {
      message.reply('you must be in the same voice-channel');
    } else {
      botGuildVoiceConnection.channel.leave();
      player.cleanPlayer(message);
    }
  },
} as Command;
