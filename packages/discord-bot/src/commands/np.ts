import { Command } from '../models';
import * as player from '../player';
import * as utils from '../utils';

module.exports = {
  name: 'np',
  description: 'show what is the current track playing',
  execute: (message, args) => {
    const queue = player.getQueue(message);
    const track = queue[0];
    const voiceConnection = message.client.voiceConnections.get(message.guild.id);
    const richEmbed = utils.generateRichEmbed('Now playing...', message.client);

    if (!track || !voiceConnection) {
      richEmbed.setDescription('No track playing');
    } else {
      const dispatcherTime = utils.secondsToHHMMSS(voiceConnection.dispatcher.time / 1000);
      const trackTime = utils.secondsToHHMMSS(track.duration);

      richEmbed.setTitle(`Now playing... (${dispatcherTime}/${trackTime})`);
      richEmbed.addField(track.title, `${utils.secondsToHHMMSS(track.duration)} — added by ${track.initiator.author.username}`);
    }

    message.channel.send(richEmbed);
  },
} as Command;
