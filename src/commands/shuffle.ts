import * as Discord from 'discord.js';

import { Command } from '../models';
import * as player from '../player';
import * as utils from '../utils';

import { shuffle } from 'lodash';

module.exports = {
  name: 'shuffle',
  description: 'shuffle the current queue',
  execute: (message, args) => {
    const guildVoiceConnection: Discord.VoiceConnection | null = message.guild.voiceConnection;

    if (!guildVoiceConnection || !guildVoiceConnection.speaking) {
      return message.reply('the bot is not in a voice-channel or playing something.');
    }

    const queue = player.getQueue(message);

    if (queue.length <= 1) {
      return message.reply('you can\'t shuffle a queue with only 1 track.');
    }

    const richEmbed = utils.generateRichEmbed('Queue shuffled', message.client);
    const currentTrack = queue.slice(0, 1)[0];
    /** We remove the first track which is the track currently playing from the shuffle */
    const shuffledQueue = shuffle(queue.slice(1, queue.length));

    shuffledQueue.unshift(currentTrack);
    player.replaceQueue(message, shuffledQueue);

    return message.channel.send(richEmbed);
  },
} as Command;
