import Discord from 'discord.js';

import { Command } from '../models';

module.exports = {
  name: 'join',
  description: 'join the voice-channel where the author of the message is connected',
  execute: (message, args) => {
    const authorVoiceChannel = message.member.voiceChannel;
    const guildVoiceConnection: Discord.VoiceConnection | null = message.guild.voiceConnection;

    if (!authorVoiceChannel) {
      message.reply('you are not in a voice-channel');
    } else if (guildVoiceConnection && guildVoiceConnection.speaking) {
      message.reply('I am currently playing on another channel');
    } else {
      authorVoiceChannel.join();
    }
  },
} as Command;
