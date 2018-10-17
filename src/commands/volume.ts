import { Command } from '../models';
import * as player from '../player';

module.exports = {
  name: 'volume',
  description: 'change the volume of the bot, must be between 0 and 100',
  execute: (message, args) => {
    const volume = args[0];

    if (!volume) {
      message.reply('you must put a value between 0 and 100 at the end of the command.');
    } else if (isNaN(parseInt(volume, 10))) {
      message.reply(`${volume} is not a valid value, it must be a number between 0 and 100.`);
    } else if (parseInt(volume, 10) < 0 || parseInt(volume, 10) > 100) {
      message.reply('please set a valid value between 0 and 100.');
    } else {
      const volumeSet = player.setVolume(message, parseInt(volume, 10));

      if (volumeSet) {
        message.channel.send(`Bot volume set to ${volume}%`);
      }
    }
  },
} as Command;
