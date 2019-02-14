import dotenv from 'dotenv';
import Discord from 'discord.js';
import _ from 'lodash';

import * as utils from './utils';
import { config } from './config/env';
import logger, { logError } from './logger';
import { Guild } from './models/api/guild.model';
import { GuildService } from './services/guild.service';
import prefixService from './services/prefix.service';

dotenv.config({
  path: require('find-config')('.env'),
});

export const client = new Discord.Client();
export const commands = utils.loadCommands();
export const prefix = config.bot.prefix;

const guildService = new GuildService();

let activityInterval: NodeJS.Timeout;

/**
 * On message handler logic.
 */
client.on('message', async (message) => {
  const text = message.content;
  const hasCustomPrefix = prefixService.has(message);
  const customPrefix = prefixService.get(message);

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
    logger.log('error', 'Unable to execute a command');
    logError(error);
    message.reply('There was an error while trying to execute this command, please try again later.');
  }
});

/**
 * When the bot is ready, setup the activity interval.
 */
client.on('ready', () => {
  activityInterval = setInterval(() => _setActivity(), 300000);
});

/**
 * When the bot joins a guild, we store this new guild into the db.
 */
client.on('guildCreate', (guild) => {
  const data: Guild = {
    guildID: guild.id,
    name: guild.name,
    ownerID: guild.ownerID,
    region: guild.region,
    iconURL: guild.iconURL || undefined,
  };

  guildService.create(data);
});

/**
 * When the bot leave a guild, we delete the guild from the db.
 */
client.on('guildDelete', (guild) => {
  guildService.delete(guild.id);
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
