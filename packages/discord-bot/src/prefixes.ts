import fs from 'fs-extra';
import path from 'path';
import Discord from 'discord.js';
import JSONDB from 'node-json-db';

export const prefixes: Discord.Collection<string, string> = new Discord.Collection();
export const unauthorizedPrefixes = ['$note', '$dev'];

const dbFilePath = path.join(__dirname, '../db/prefixes.json');

/** We need to ensure that `db/prefixes.json` exists */
fs.ensureFileSync(dbFilePath);

/**
 * If the DB file have been created, it is empty and we need to initialize a
 * JSON object inside.
 */
if (fs.readFileSync(dbFilePath).toString('utf8').length <= 0) {
  fs.writeFileSync(dbFilePath, '{}');
}

const db = new JSONDB(dbFilePath, true, true);

/**
 * Load all prefixes from the JSON DB into the Discord collection `prefixes`,
 * return a promise which is resolved when it's done.
 */
export function loadPrefixes(): Promise<Discord.Collection<string, string>> {
  const dbPrefixes = db.getData('/') as { [guildID: string ]: string};
  const prefixesKeys = Object.keys(dbPrefixes);

  return new Promise((resolve, reject) => {
    try {
      for (const key of prefixesKeys) {
        const guildPrefix = dbPrefixes[key];

        prefixes.set(key, guildPrefix);
      }

      return resolve(prefixes);
    } catch (error) {
      return reject(error);
    }
  });
}

/**
 * Set a new prefix both on the `prefixes` colletion (to be used in real-time)
 * and on the JSON DB (persistence).
 *
 * @param message the discord message that initiated this
 * @param prefix the guild prefix
 */
export function setPrefix(message: Discord.Message, prefix: string) {
  const guildID = message.guild.id;

  db.push(`/${guildID}`, prefix, true);
  prefixes.set(guildID, prefix!);
}

/**
 * Check if a specific guild ID have setup a custom prefix.
 *
 * @param message the discord message that initiated this
 */
export function hasPrefix(message: Discord.Message): boolean {
  return prefixes.has(message.guild.id);
}

/**
 * Try to get the custom prefix setup on a specific guild, if it exists.
 *
 * @param message the discord message that initiated this
 */
export function getPrefix(message: Discord.Message) {
  return prefixes.get(message.guild.id);
}
