import { Command } from '../models';

import * as prefixes from '../prefixes';

module.exports = {
  name: 'prefix',
  description: 'set or change a custom prefix for this guild',
  execute: (message, args) => {
    const hasPrefix = prefixes.hasPrefix(message);

    if (message.guild.ownerID !== message.member.id) {
      return message.reply('only the guild owner can change the custom prefix.');
    }

    if (!args[0]) {
      let str = 'you haven\'t put a custom prefix in the command. ';

      if (hasPrefix) {
        const customPrefix = prefixes.getPrefix(message);

        str += 'The guild owner have already setup a custom prefix which is **' + customPrefix + '**.';
      }

      return message.reply(str);
    }

    const prefix = args[0];

    if (prefixes.unauthorizedPrefixes.indexOf(prefix) > -1) {
      return message.reply(`**${prefix}** is an unauthorized prefix, please choose another one.`);
    }

    prefixes.setPrefix(message, prefix);
    prefixes.savePrefixes()
      .then(() => message.reply(`the custom prefix have been successfully changed to **${prefix}**, be sure to notify your guild members of this change!`));
  },
} as Command;
