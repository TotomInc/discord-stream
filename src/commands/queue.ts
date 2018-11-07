import _ from 'lodash';

import { Command } from '../models';
import * as utils from '../utils';
import * as player from '../player';

const prefix = process.env['PREFIX'];
const pageSize = 10;

module.exports = {
  name: 'queue',
  description: `show all queued tracks, ${pageSize} tracks/page (ex: \`${prefix} queue 2\` to list page 2 of the queue)`,
  execute: (message, args) => {
    const pageIndexArg: string | undefined = args[0];
    const tracks = player.getQueue(message);
    const tracksPages = _.chunk(tracks, pageSize);
    const richEmbed = utils.generateRichEmbed('Queued tracks', message.client);

    if (tracks.length <= 0) {
      richEmbed.addField('There are no queued tracks.', 'You can add tracks with the play command.');
    } else if (pageIndexArg && !isNaN(parseInt(pageIndexArg))) {
      const pageIndex = parseInt(pageIndexArg);

      if (pageIndex > tracksPages.length || pageIndex < 1) {
        return message.reply(`this is not a valid page-index, please put a value between 1 and ${tracksPages.length}.`);
      }

      const pageIndexTracks = tracksPages[pageIndex - 1];

      pageIndexTracks.forEach((track, i) => richEmbed.addField(`${i + 1 + (10 * (pageIndex - 1))}. ${track.title}`, `${utils.secondsToHHMMSS(track.duration)} — Added by ${track.initiator.author.username}`));
      richEmbed.setTitle(`Queued tracks - page ${pageIndex}/${tracksPages.length}`);
    } else if (pageIndexArg && isNaN(parseInt(pageIndexArg))) {
      return message.reply(`this is not a valid page-index, please put a value between 1 and ${tracksPages.length}.`);
    } else {
      const pageIndexTracks = tracksPages[0];

      pageIndexTracks.forEach((track, i) => richEmbed.addField(`${i + 1}. ${track.title}`, `${utils.secondsToHHMMSS(track.duration)} — Added by ${track.initiator.author.username}`));
      richEmbed.setTitle(`Queued tracks - page 1/${tracksPages.length}`);
    }

    return message.channel.send(richEmbed);
  },
} as Command;
