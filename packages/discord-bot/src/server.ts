import dotenv from 'dotenv';
import Discord from 'discord.js';
import _ from 'lodash';

import * as utils from './utils';
import { prefixes } from './prefixes';

dotenv.config({
  path: require('find-config')('.env'),
});

export const client = new Discord.Client();
export const commands = utils.loadCommands();
export const prefix = process.env['PREFIX'] as string;

let activityInterval: NodeJS.Timeout;

client.on('message', async (message) => {
  const text = message.content;
  const hasCustomPrefix = prefixes.has(message.guild.id);
  const customPrefix = (hasCustomPrefix)
    ? prefixes.get(message.guild.id)
    : undefined;

  if (
    (!hasCustomPrefix && !text.startsWith(prefix))
    || (hasCustomPrefix && !text.startsWith(prefix) && !text.startsWith(customPrefix!))
    || message.author.bot
  ) {
    return;
  }

  const args = (text.startsWith(customPrefix!))
    ? text.trim().slice(customPrefix!.length).trim().split(/ +/)
    : text.trim().slice(prefix.length).trim().split(/ +/);

  const command = args.shift()!.toLowerCase();

  if (!commands.has(command)) {
    return;
  }

  try {
    commands.get(command)!.execute(message, args);
  } catch (error) {
    // TODO: log command execution failure
    message.reply('There was an error while trying to execute this command, please try again later.');
  }
});

client.on('ready', () => {
  activityInterval = setInterval(() => _setActivity(), 300000);
});

/**
 * Update the bot status message by picking a random message from the list.
 */
function _setActivity() {
  const messages = [
    `for ${client.guilds.array().length} guilds | ${prefix} help`,
    `for ${_getAmountUsers()} users | ${prefix} help`,
  ];
  const message = _.sample(messages);

  if (message) {
    client.user.setActivity(message);
  }
}

/**
 * Get the total amount of users by looping on each guild that uses the bot.
 */
function _getAmountUsers(): number {
  let users = 0;

  client.guilds.forEach((guild) => {
    users += guild.memberCount;
  });

  return users;
}
