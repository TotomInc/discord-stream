import dotenv from 'dotenv';
import Discord from 'discord.js';
import Debug from 'debug';

import * as utils from './utils';
import { prefixes } from './prefixes';

dotenv.config({
  path: require('find-config')('.env'),
});

const debug = Debug('streamer:server');

export const client = new Discord.Client();
export const commands = utils.loadCommands();
export const prefix = process.env['PREFIX'] as string;

/** Interval duration set to 30 minutes */
const statusIntervalDuration = 1.8e+6;
let statusInterval: NodeJS.Timer | undefined;

/**
 * Listen for a new message sent, make sure it starts with the prefix and is
 * not from a bot.
 *
 * We can now process the message:
 *  - remove extra whitespaces, trim
 *  - slice for each whitespace and retrieve arguments
 *  - shift the arguments to retrieve the command name
 *
 * If the command name exists in our `commands` collection, we can get it and
 * execute this command. We always pass in a `command.execute` the message with
 * arguments.
 */
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
    debug('could not execute command: %s', text);
    message.reply('There was an error while trying to execute this command, please try again later.');
  }
});

client.on('ready', () => {
  statusInterval = setInterval(() => {
    client.user.setActivity(`for ${client.guilds.array().length} guilds | ${prefix} help`);
  }, statusIntervalDuration);
});
