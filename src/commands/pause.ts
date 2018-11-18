import * as Discord from 'discord.js';

import { Command } from '../models';
import * as player from '../player';
import * as utils from '../utils';

module.exports = {
  name: 'pause',
  description: 'pause current song',
  execute: (message, args) => {
    const guildVoiceConnection: Discord.VoiceConnection | null = message.guild.voiceConnection;

    if (!guildVoiceConnection || !guildVoiceConnection.speaking) {
      message.reply('the bot is not speaking, try to play something.');
    } else {
      const richEmbed = utils.generateRichEmbed('Track paused...', message.client);
      const currentTrack = player.getCurrentTrack(message);

      if (currentTrack) {
        const trackTime = guildVoiceConnection.dispatcher.time / 1000;

        richEmbed.addField(currentTrack.title, `${utils.secondsToHHMMSS(trackTime)}/${utils.secondsToHHMMSS(currentTrack.duration)}`);
      }

      guildVoiceConnection.dispatcher.pause();
      message.channel.send(richEmbed);
    }
  },
} as Command;
