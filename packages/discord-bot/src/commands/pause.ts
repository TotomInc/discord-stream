import * as Discord from 'discord.js';

import { generateRichEmbed } from '../utils/rich-embed';
import { secondsToHHMMSS } from '../utils/time';
import { Command } from '../models';
import * as player from '../player';

module.exports = {
  name: 'pause',
  description: 'pause current song',
  execute: (message, args) => {
    const guildVoiceConnection: Discord.VoiceConnection | null = message.guild.voiceConnection;

    if (!guildVoiceConnection || !guildVoiceConnection.speaking) {
      message.reply('the bot is not speaking, try to play something.');
    } else {
      const richEmbed = generateRichEmbed('Track paused...', message.client);
      const currentTrack = player.getCurrentTrack(message);

      if (currentTrack) {
        const trackTime = guildVoiceConnection.dispatcher.time / 1000;

        richEmbed.addField(currentTrack.title, `${secondsToHHMMSS(trackTime)}/${secondsToHHMMSS(currentTrack.duration)}`);
      }

      guildVoiceConnection.dispatcher.pause();
      message.channel.send(richEmbed);
    }
  },
} as Command;
