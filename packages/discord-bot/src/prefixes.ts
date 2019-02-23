import { Collection, Message } from 'discord.js';

import { Guild } from './models';
import { config } from './config/env';
import { GuildService } from './services/guild.service';
import { LoggerService } from './services/logger.service';

export const prefixes = new Collection<string, string>();

const guildService = new GuildService();
const loggerService = new LoggerService();

const unauthorizedPrefixes = [config.bot.prefix, '$note'];
const unauthorizedCharacters = ['%'];

/**
 * Fetch all guilds prefixes and automatically inject them into a
 * `Discord.Collection`. If success, return this collection. This is used to
 * initialize the prefixes when the bot is starting. Returns the collection.
 */
export function load(): Promise<Collection<string, string>> {
  return new Promise((resolve, reject) => {
    guildService.getAllPrefixes()
      .then(response => response.data)
      .then((guildPrefixes) => {
        for (const [guildID, prefix] of Object.entries(guildPrefixes)) {
          prefixes.set(guildID, decodeURIComponent(prefix));
        }

        resolve(prefixes);
      })
      .catch((err) => {
        loggerService.log.error(err, 'unable to load prefixes');

        reject(err);
      });
  });
}

/**
 * Update or create the custom-prefix for the guild retrieved from the
 * message, call the API and then update the `prefix` collection to update
 * in realtime. Returns the updated `Guild`.
 *
 * @param message Discord message
 * @param prefix new prefix for the guild
 */
export function set(message: Message, prefix: string): Promise<Guild> {
  const data = {
    customPrefix: encodeURIComponent(prefix),
  };

  return new Promise((resolve, reject) => {
    guildService.updatePrefix(message.guild.id, data)
      .then(response => response.data)
      .then((guild) => {
        prefixes.set(message.guild.id, prefix);

        resolve(guild);
      })
      .catch((err) => {
        loggerService.log.error(err, 'unable to set prefix: %s', prefix);

        reject(err);
      });
  });
}

/**
 * Delete a custom-prefix for the guild retrieved from the message parameter,
 * call the API and then update the `prefix` collection to update in
 * realtime. Returns the updated `Guild`.
 *
 * @param message Discord message
 */
export function remove(message: Message): Promise<Guild> {
  return new Promise((resolve, reject) => {
    guildService.deletePrefix(message.guild.id)
      .then(response => response.data)
      .then((guild) => {
        prefixes.delete(message.guild.id);

        resolve(guild);
      })
      .catch((err) => {
        loggerService.log.error(err, 'unable to remove prefix');

        reject(err);
      });
  });
}

/**
 * Verify if the guild from the message have setup a custom-prefix.
 *
 * @param message Discord message
 */
export function has(message: Message) {
  return prefixes.has(message.guild.id);
}

/**
 * Return the guild custom-prefix from the message.
 *
 * @param message Discord message
 */
export function get(message: Message) {
  return prefixes.get(message.guild.id);
}

/**
 * Check if the prefix is valid.
 *
 * @param prefix new prefix for the guild
 */
export function check(prefix: string) {
  const unauthorizedPrefix = unauthorizedPrefixes.find(unauth => unauth.includes(prefix));
  const unauthorizedCharacter = unauthorizedCharacters.find(unauth => prefix.includes(unauth));

  return { unauthorizedPrefix, unauthorizedCharacter };
}
