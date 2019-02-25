import _ from 'lodash';

import { Command } from '../models';
import { generateRichEmbed } from '../utils/rich-embed';
import * as player from '../player';

module.exports = {
  name: 'removedupes',
  description: 'removes duplicate songs from the queue',
  execute: async (message, args) => {
    const queue = player.getQueue(message);

    if (queue.length <= 0) {
      return message.reply('there are no queued tracks.');
    }

    const filteredTracks = _.uniqBy(queue, track => track.streamURL);

    player.replaceQueue(filteredTracks, message);

    const richEmbed = generateRichEmbed('Queue cleaned', message.client)
      .setDescription('Duplicates have been removed from the queue.');

    message.channel.send(richEmbed);
  },
} as Command;
