import { Command } from '../models';
import * as utils from '../utils';

module.exports = {
  name: 'help',
  description: 'show all available commands',
  execute: (message, args) => {
    const commands = utils.loadCommands();
    const embed = utils.generateRichEmbed('List of commands');

    commands.forEach((command) => embed.addField(command.name, command.description));
    message.channel.send(embed);
  },
} as Command;
