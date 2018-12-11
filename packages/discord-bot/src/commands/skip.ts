import { Command } from '../models';
import * as player from '../player';

module.exports = {
  name: 'skip',
  description: 'skip the current track',
  execute: (message, args) => {
    player.stopTrack(message);
  },
} as Command;
