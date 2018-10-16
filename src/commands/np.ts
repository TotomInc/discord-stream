import { Command } from '../models';
import * as player from '../player';
import * as utils from '../utils';

module.exports = {
  name: 'np',
  description: 'show what is the current track playing',
  execute: (message, args) => {
    const queue = player.getQueue(message);
    const track = queue[0];
    const richEmbed = utils.generateRichEmbed('Now playing...', message.client);

    if (!track) {
      richEmbed.setDescription('No track playing');
    } else {
      richEmbed.addField(track.title, `${utils.secondsToHHMMSS(track.duration)} — added by ${track.initiator.author.username}`);
    }

    message.channel.send(richEmbed);
  },
} as Command;
