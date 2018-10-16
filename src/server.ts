import Discord from 'discord.js';
import Debug from 'debug';
import http from 'http';

import * as utils from './utils';

const debug = Debug('streamer:server');

/**
 * This is required for the deployment on `zeit.co` or the deployment will fail
 * since it can't see any app listening on an HTTP port. We don't run anything
 * on ir, it is just a dummy http-server to trick `zeit.co`.
 */
const webserver = http.createServer().listen(3000);

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
  if (!message.content.startsWith('$str') || message.author.bot) {
    return;
  }

  const args = message.content.trim().slice(5).split(/ +/);
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

client.on('ready', () => {
  client.user.setActivity(`for ${client.guilds.array().length} guilds | $str help`);
});
