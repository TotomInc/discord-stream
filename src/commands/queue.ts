import { Command } from '../models';
import * as utils from '../utils';
import * as player from '../player';

module.exports = {
  name: 'queue',
  description: 'show all queued tracks',
  execute: (message, args) => {
    const tracks = player.getQueue(message);
    const richEmbed = utils.generateRichEmbed('Queued tracks', message.client);

    if (tracks.length === 0) {
      richEmbed.addField('There are no queued tracks.', 'You can add tracks with the play command.');
    } else {
      tracks.forEach((track, i) => {
        richEmbed.addField(
          (i === 0) ? `:arrow_forward: ${track.title}` : track.title,
          `${utils.secondsToHHMMSS(track.duration)} — Added by ${track.initiator.author.username}`,
        );
      });
    }

    message.channel.send(richEmbed);
  },
} as Command;
