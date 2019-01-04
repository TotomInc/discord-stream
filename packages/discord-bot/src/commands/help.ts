import { Command } from '../models';
import * as prefixes from '../prefixes';
import * as utils from '../utils';

module.exports = {
  name: 'help',
  description: 'show all available commands',
  execute: (message, args) => {
    const commands = utils.loadCommands();
    const embed = utils.generateRichEmbed('List of commands', message.client);
    const customPrefix = prefixes.getPrefix(message);

    if (customPrefix) {
      embed.addField('I have a custom prefix on this server', `You can also call me by using the **${customPrefix}** prefix.`);
    }

    commands
      .filter((command) => !command.invisible)
      .forEach((command) => embed.addField(command.name, command.description));

    message.channel.send(embed);
  },
} as Command;
