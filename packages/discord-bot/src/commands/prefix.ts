import prefixesService from '../services/prefix.service';
import { config } from '../config/env';
import { logError } from '../logger';
import { Command } from '../models';

const prefix = config.bot.prefix;

module.exports = {
  name: 'prefix',
  description: `set or change a custom prefix for this guild, you can also delete a prefix by sending \`${prefix} prefix delete\``,
  execute: (message, args) => {
    const customPrefix = prefixesService.get(message);
    const deleteMode = (args[0] === 'delete');

    /**
     * If a custom prefix have already been setup and someone else than the
     * guild owner tries to change it.
     */
    if (customPrefix && message.member.id !== message.guild.ownerID) {
      return message.reply(`the guild owner have already setup a custom prefix for your server which is \`${customPrefix}\`.`);
    }

    /**
     * If someone else than the guild owner tries to change the prefix.
     */
    if (message.member.id !== message.guild.ownerID) {
      return message.reply('only the guild owner can change or delete the custom prefix setup for this server.');
    }

    /**
     * If owner tries to delete the custom prefix but there are no
     * custom-prefix setup.
     */
    if (deleteMode && !customPrefix) {
      return message.reply('I don\'t have a custom prefix on this server.');
    }

    /**
     * If the first argument is the keyword `delete`, we proceed to delete the
     * custom prefix for this guild if it exists.
     */
    if (deleteMode && customPrefix) {
      return prefixesService.delete(message)
        .then(() => message.reply(`my custom prefix on this server have been deleted, you can still call me with the prefix \`${prefix}\`.`))
        .catch((err) => {
          logError(err);

          return message.reply('I am unable to delete the prefix on this server.');
        });
    }

    const newPrefix = args[0] as string | undefined;

    /**
     * If the guild owner try to change the custom prefix but doesn't pass a
     * prefix.
     */
    if (!newPrefix) {
      return message.reply(`you haven\'t put a custom prefix in the command, example: \`${prefix} prefix <your-prefix>\`.`);
    }

    const validPrefix = prefixesService.check(newPrefix);

    /**
     * If the guild owner tries to put an unauthorized custom prefix.
     */
    if (validPrefix.unauthorizedPrefix) {
      return message.reply(`\`${newPrefix}\` is an unauthorized prefix, please choose another one.`);
    }

    /**
     * If the guild owner tries to put a prefix with an unauthorized character.
     */
    if (validPrefix.unauthorizedCharacter) {
      return message.reply(`\`${newPrefix}\` contains an unauthorized character (\`${validPrefix.unauthorizedCharacter}\`), please choose another prefix.`);
    }

    /**
     * Finally setup the custom-prefix after it has successfully passed all
     * conditions.
     */
    prefixesService.set(message, newPrefix)
      .then(() => message.reply(`the custom prefix have been successfully changed to \`${newPrefix}\`, be sure to notify your guild members of this change!`))
      .catch((err) => {
        logError(err);

        return message.reply('I am unable to change your prefix, please try again later.');
      });
  },
} as Command;
