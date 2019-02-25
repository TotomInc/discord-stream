import { Command } from '../models';
import * as prefixes from '../prefixes';
import { loadCommands } from '../utils/load-commands';
import { generateRichEmbed } from '../utils/rich-embed';

module.exports = {
  name: 'help',
  description: 'show all available commands',
  execute: (message, args) => {
    const commands = loadCommands();
    const embed = generateRichEmbed('List of commands', message.client);
    const customPrefix = prefixes.get(message);

    if (customPrefix) {
      embed.addField(
        'I have a custom prefix on this server',
        `You can also call me by using the **${customPrefix}** prefix.`,
      );
    }

    commands
      .filter(command => !command.invisible)
      .forEach(command => embed.addField(command.name, command.description));

    message.channel.send(embed);
  },
} as Command;
