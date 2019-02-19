import * as Discord from 'discord.js';

import { Command } from '../models';
import { getQueue, removeTracks, removeQueue } from '../player';

module.exports = {
  name: 'clear',
  description: 'remove all queued tracks (except the currently playing track)',
  execute: (message, args) => {
    const tracks = getQueue(message);
    const guildVoiceConnection: Discord.VoiceConnection | null = message.guild.voiceConnection;

    if (tracks.length <= 0) {
      return message.reply('there are no tracks in the queue.');
    }

    if (guildVoiceConnection && guildVoiceConnection.speaking) {
      removeTracks(1, tracks.length, message);

      message.channel.send('Removed all tracks from the queue excepted the currently playing track.');
    } else {
      removeQueue(message);

      message.channel.send('Successfully removed all tracks from the queue.');
    }
  },
} as Command;
