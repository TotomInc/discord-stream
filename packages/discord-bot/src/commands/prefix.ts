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
      return message.reply(`the guild owner have already setup a custom prefix for your server which is \`${customPrefix}\`.`);
    }

    /** If someone else than the guild owner tries to change the prefix */
    if (message.member.id !== message.guild.ownerID) {
      return message.reply('only the guild owner can change or delete the custom prefix setup for this server.');
    }

    /**
     * If the first argument is the keyword `delete`, we proceed to delete the
     * custom prefix for this guild
     */
    if (args[0] === 'delete') {
      return prefixes.deletePrefix(message)
        .then(() => message.reply(`my custom prefix on this server have been deleted, you can still call me with the prefix \`${prefix}\`.`))
        .catch((err) => {
          logError(err);
          return message.reply('I am unable to delete the prefix on this server.');
        });
    }

    /**
     * If the guild owner try to change the custom prefix but doesn't pass a
     * prefix
     */
    if (!args[0]) {
      return message.reply(`you haven\'t put a custom prefix in the command, example: \`${prefix} prefix <your-prefix>\`.`);
    }

    const newPrefix = args[0];
    const includeUnauthorizedPrefix = prefixes.unauthorizedPrefixes.find((p) => p.includes(newPrefix));
    const includeUnauthorizedCharacter = prefixes.unauthorizedCharacters.find((char) => newPrefix.includes(char));

    /** If the guild owner tries to put an unauthorized custom prefix */
    if (prefixes.unauthorizedPrefixes.indexOf(newPrefix) > -1 || includeUnauthorizedPrefix) {
      return message.reply(`\`${newPrefix}\` is an unauthorized prefix, please choose another one.`);
    }

    /** If the guild owner tries to put a prefix with an unauthorized character */
    if (includeUnauthorizedCharacter) {
      return message.reply(`\`${newPrefix}\` contains an unauthorized character (\`${includeUnauthorizedCharacter}\`), please choose another prefix.`);
    }

    prefixes.setPrefix(message, newPrefix)
      .then(() => message.reply(`the custom prefix have been successfully changed to \`${newPrefix}\`, be sure to notify your guild members of this change!`))
      .catch((err) => {
        logError(err);
        return message.reply('I am unable to change your prefix.');
      })
  },
} as Command;
