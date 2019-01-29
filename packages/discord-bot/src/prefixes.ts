import dotenv from 'dotenv';
import Discord from 'discord.js';

import * as models from './models';
import http from './http';

dotenv.config({
  path: require('find-config')('.env'),
});

export const prefixesCollection: Discord.Collection<string, string> = new Discord.Collection();
export const unauthorizedPrefixes = ['$note', '$dev'];
export const unauthorizedCharacters = ['%'];

const MONGO_SERVER_URL = process.env['MONGO_SERVER_URL'];

if (!MONGO_SERVER_URL) {
  throw new Error('No MONGO_SERVER_URL specified in the .env file');
}

/**
 * Call the prefixes API endpoint to retrieve all prefixes and map them into a
 * Discord collection. The promise resolve when the prefixes are fully loaded
 * into the collection.
 */
export function loadPrefixes(): Promise<Discord.Collection<string, string>> {
  return new Promise((resolve, reject) => {
    http.get<models.Prefix[]>(`prefixes`)
      .then((response) => response.data)
      .then((prefixes) => {
        for (const prefix of prefixes) {
          prefixesCollection.set(prefix.guildID, prefix.prefix);
        }

        resolve(prefixesCollection);
      })
      .catch((err) => reject(err));
  });
}

/**
 * Set the new prefix for a guild with the API in the DB. Returns a promise
 * which resolves if the response status code is `200`. Update in real-time
 * the prefixes collection.
 *
 * @param message the discord message that initiated this
 * @param prefix the guild prefix
 */
export function setPrefix(message: Discord.Message, prefix: string): Promise<Discord.Collection<string, string>> {
  const guildID = message.guild.id;
  // Prefix needs to be encoded when used as query HTTP parameters
  const encodedPrefix = encodeURIComponent(prefix);

  return new Promise((resolve, reject) => {
    http.put<models.Prefix>(`prefixes/${guildID}?prefix=${encodedPrefix}`)
      .then((response) => {
        if (response.status === 200) {
          prefixesCollection.set(guildID, prefix);
          resolve(prefixesCollection);
        } else {
          reject(new Error(`Bad status code response: ${response.status} - ${response.statusText}`));
        }
      })
      .catch((err) => err);
  });
}

/**
 * Delete the prefix for a guild by calling the API, then remove the guild
 * prefix in real-time from the collection.
 *
 * @param message the discord message that initiated this
 */
export function deletePrefix(message: Discord.Message): Promise<Discord.Collection<string, string>> {
  const guildID = message.guild.id;

  return new Promise((resolve, reject) => {
    http.delete(`prefixes/${guildID}`)
      .then((response) => {
        if (response.status === 200) {
          prefixesCollection.delete(guildID);
          resolve(prefixesCollection);
        } else {
          reject(new Error(`Bad status code response: ${response.status} - ${response.statusText}`));
        }
      })
      .catch((err) => err);
  });
}

/**
 * Check if a specific guild ID have setup a custom prefix.
 *
 * @param message the discord message that initiated this
 */
export function hasPrefix(message: Discord.Message): boolean {
  return prefixesCollection.has(message.guild.id);
}

/**
 * Try to get the custom prefix setup on a specific guild, if it exists.
 *
 * @param message the discord message that initiated this
 */
export function getPrefix(message: Discord.Message) {
  return prefixesCollection.get(message.guild.id);
}
