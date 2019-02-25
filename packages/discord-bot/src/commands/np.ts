import { generateRichEmbed } from '../utils/rich-embed';
import { secondsToHHMMSS } from '../utils/time';
import { Command } from '../models';
import * as player from '../player';

module.exports = {
  name: 'np',
  description: 'show what is the current track playing',
  execute: (message, args) => {
    const queue = player.getQueue(message);
    const track = queue[0];
    const voiceConnection = message.client.voiceConnections.get(message.guild.id);
    const richEmbed = generateRichEmbed('Now playing...', message.client);

    if (!track || !voiceConnection) {
      richEmbed.setDescription('No track playing');
    } else {
      const dispatcherTime = secondsToHHMMSS(voiceConnection.dispatcher.time / 1000);
      const trackTime = secondsToHHMMSS(track.duration);

      richEmbed.setTitle(`Now playing... (${dispatcherTime}/${trackTime})`);
      richEmbed.addField(track.title, `${secondsToHHMMSS(track.duration)} — added by ${track.initiator.author.username}`);
    }

    message.channel.send(richEmbed);
  },
} as Command;
