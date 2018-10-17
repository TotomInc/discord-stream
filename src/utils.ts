import fs from 'fs';
import { URL } from 'url';
import path from 'path';
import Discord from 'discord.js';
import Debug from 'debug';
import Moment from 'moment';

import { Command, providers } from './models';

const debug = Debug('streamer:utils');
const providers: providers[] = ['youtube'];

/**
 * Load all command files in `src/commands` and return a collection of commands.
 */
export function loadCommands() {
  const files = fs.readdirSync(path.join(__dirname, '/commands'));
  const commands = new Discord.Collection<string, Command>();

  files.forEach((file) => {
    const command = require(`./commands/${file}`) as Command;

    commands.set(command.name, command);
  });

  return commands;
}

/**
 * Generate a rich-embed, must use this function to keep the same rich-embed
 * style across all the commands.
 *
 * @param title name of the rich-embed
 */
export function generateRichEmbed(title: string, client: Discord.Client) {
  const avatarURL = client.user.avatarURL;
  const richEmbed = new Discord.RichEmbed()
    .setColor('#c0f289')
    .setTitle(title)
    .setFooter('Got a bug? Contact TotomInc#3203')
    .setTimestamp();

  richEmbed.author = {
    name: client.user.username,
    icon_url: avatarURL,
  }

  return richEmbed;
}

/**
 * Check if a query is a URL by using the URL module from Node, if it throws an
 * error, the query is not an URL.
 *
 * @param query a query to check if it is a URL
 */
export function isURL(query: string) {
  try {
    new URL(query);
  } catch (error) {
    return false;
  }

  return true;
}

/**
 * Determinate the video/sound provider of a URL based on the `providers`
 * constant.
 *
 * @param url an URL to a video or sound service
 */
export function detectURLProvider(url: string): providers | undefined {
  return providers.find((provider) => url.indexOf(provider) > -1);
}

/**
 * Nicely formats from seconds to mm:ss using Moment.js.
 *
 * @param seconds number of seconds, must be a number
 */
export function secondsToHHMMSS(seconds: number | string): string {
  const val = (typeof seconds === 'string') ? parseInt(seconds) : seconds;

  return Moment()
    .startOf('day')
    .seconds(val)
    .format('mm:ss');
}
