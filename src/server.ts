import Discord from 'discord.js';
import Debug from 'debug';

import * as utils from './utils';

const debug = Debug('streamer:server');

export const client = new Discord.Client();
export const commands = utils.loadCommands();

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
  if (!message.content.startsWith('$') || message.author.bot) {
    return;
  }

  const args = message.content.trim().slice(1).split(/ +/);
  const command = args.shift()!.toLowerCase();

  if (!commands.has(command)) {
    return;
  }

  try {
    commands.get(command)!.execute(message, args);
  } catch (error) {
    debug('could not execute command: %s', message.content);
    message.reply('There was an error while trying to execute this command :think:');
  }
});
