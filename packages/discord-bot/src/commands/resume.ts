import * as Discord from 'discord.js';

import { Command } from '../models';
import { generateRichEmbed } from '../utils/rich-embed';
import { secondsToHHMMSS } from '../utils/time';
import * as player from '../player';

module.exports = {
  name: 'resume',
  description: 'resume the song that have been paused',
  execute: (message, args) => {
    const guildVoiceConnection: Discord.VoiceConnection | null = message.guild.voiceConnection;
    const hasQueue = player.getQueue(message);

    if (!guildVoiceConnection || (!guildVoiceConnection.speaking && hasQueue.length < 1)) {
      message.reply('the bot isn\'t connected to a voice-channel or doesn\'t have queued tracks.');
    } else {
      const richEmbed = generateRichEmbed('Resume track', message.client);
      const currentTrack = player.getCurrentTrack(message);

      if (currentTrack) {
        const trackTime = (guildVoiceConnection.dispatcher.time / 1000);

        richEmbed.addField(
          currentTrack.title,
          `${secondsToHHMMSS(trackTime)}/${secondsToHHMMSS(currentTrack.duration)}`,
        );
      }

      guildVoiceConnection.dispatcher.resume();
      message.channel.send(richEmbed);
    }
  },
} as Command;
