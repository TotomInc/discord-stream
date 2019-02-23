import Discord from 'discord.js';
import _ from 'lodash';

import { config } from './config/env';
import { loadCommands } from './utils/load-commands';
import * as prefixes from './prefixes';
import { Guild } from './models/api/guild.model';
import { GuildService } from './services/guild.service';
import { LoggerService } from './services/logger.service';

export const client = new Discord.Client();
export const commands = loadCommands();

const guildService = new GuildService();
const loggerService = new LoggerService();

/**
 * On message handler logic.
 */
client.on('message', async (message) => {
  const text = message.content;
  const hasCustomPrefix = prefixes.has(message);
  const customPrefix = prefixes.get(message);

  if (
    (!hasCustomPrefix && !text.startsWith(config.bot.prefix))
    || (hasCustomPrefix && !text.startsWith(config.bot.prefix) && !text.startsWith(customPrefix!))
    || message.author.bot
  ) {
    return;
  }

  const args = (text.startsWith(customPrefix!))
    ? text.trim().slice(customPrefix!.length).trim().split(/ +/)
    : text.trim().slice(config.bot.prefix.length).trim().split(/ +/);

  const command = args.shift()!.toLowerCase();

  if (!commands.has(command)) {
    return;
  }

  try {
    commands.get(command)!.execute(message, args);
  } catch (error) {
    loggerService.log.error(new Error(`Unable to execute a command: ${command}`));

    message.reply('There was an error while trying to execute this command, please try again later.');
  }
});

/**
 * When the bot is ready, setup the activity interval.
 */
client.on('ready', () => {
  const activity = `for ${client.guilds.keyArray().length} guilds | ${config.bot.prefix} help`;

  client.user.setActivity(activity);
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
