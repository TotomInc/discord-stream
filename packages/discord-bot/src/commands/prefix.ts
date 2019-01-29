import { Command } from '../models';

import * as prefixes from '../prefixes';
import { logError } from '../logger';

const prefix = process.env['PREFIX'];

module.exports = {
  name: 'prefix',
  description: 'set or change a custom prefix for this guild',
  execute: (message, args) => {
    const customPrefix = prefixes.getPrefix(message);

    /**
     * If a custom prefix have already been setup and someone else than the
     * guild owner tries to change it
     */
    if (customPrefix && message.member.id !== message.guild.ownerID) {
      return message.reply(`the guild owner have already setup a custom prefix for your guild which is \`${customPrefix}\``);
    }

    /** If someone else than the guild owner tries to change the prefix */
    if (message.member.id !== message.guild.ownerID) {
      return message.reply('only the guild owner can change the custom prefix.');
    }

    /**
     * If the guild owner try to change the custom prefix but doesn't pass a
     * prefix
     */
    if (!args[0]) {
      return message.reply(`you haven\'t put a custom prefix in the command, example: \`${prefix} prefix <your-prefix>\``);
    }

    const newPrefix = args[0];
    const includeUnauthorizedPrefix = !!prefixes.unauthorizedPrefixes.filter((p) => p.includes(newPrefix));

    /** If the guild owner tries to put an unauthorized custom prefix */
    if (prefixes.unauthorizedPrefixes.indexOf(newPrefix) > -1 || includeUnauthorizedPrefix) {
      return message.reply(`\`${newPrefix}\` is an unauthorized prefix, please choose another one.`);
    }

    prefixes.setPrefix(message, newPrefix)
      .then(() => message.reply(`the custom prefix have been successfully changed to \`${newPrefix}\`, be sure to notify your guild members of this change!`))
      .catch((err) => {
        logError(err);
        return message.reply('I am unable to change your prefix.');
      })
  },
} as Command;
