import _ from 'lodash';

import { generateRichEmbed } from '../utils/rich-embed';
import { Command } from '../models';
import * as player from '../player';

module.exports = {
  name: 'leavecleanup',
  description: 'removes tracks queued by absent users (users non-connected to the voice-channel)',
  execute: async (message, args) => {
    const voiceConnection = message.client.voiceConnections.get(message.guild.id);

    if (!voiceConnection) {
      return message.reply('I am not connected to a voice-channel.');
    }

    const queue = player.getQueue(message);

    if (queue.length <= 0) {
      return message.reply('the queue is empty.');
    }

    const voiceChannelMembers = voiceConnection.channel.members.array();
    const filteredQueue = queue.filter(track =>
      voiceChannelMembers.find(member => member.id === track.initiator.member.id),
    );

    player.replaceQueue(filteredQueue, message);

    const richEmbed = generateRichEmbed('Queue cleaned', message.client)
      .setDescription('Removed tracks queued by absent users.');

    message.channel.send(richEmbed);
  },
} as Command;
