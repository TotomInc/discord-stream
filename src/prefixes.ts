import path from 'path';
import fs from 'fs';
import Discord from 'discord.js';

import * as storedPrefixes from '../store/prefixes.json';

export const prefixes: Discord.Collection<string, string> = new Discord.Collection();
export const unauthorizedPrefixes = ['$note', '$dev'];

export function loadPrefixes(): Promise<Discord.Collection<string, string>> {
  return new Promise((res, rej) => {
    Object.entries(storedPrefixes).forEach((entry) => {
      const guildID = entry[0];
      const prefix = entry[1];

      // By default, when TypeScript import a `.json` file, it imports it as a
      // CommonJS module and have the `default` object.
      if (guildID === 'default') {
        return;
      }

      prefixes.set(guildID, prefix);
    });

    res(prefixes);
  });
};

export function hasPrefix(message: Discord.Message) {
  return prefixes.has(message.guild.id);
}

export function getPrefix(message: Discord.Message) {
  return prefixes.get(message.guild.id);
}

export function setPrefix(message: Discord.Message, prefix: string) {
  return prefixes.set(message.guild.id, prefix);
}

export function savePrefixes() {
  return new Promise((res, rej) => {
    const prefixesPath = path.join(__dirname, '../store/prefixes.json');
    const arrayFromMap = Array.from(prefixes.entries());
    // @ts-ignore
    const arrayToObject = Object.assign(...arrayFromMap.map(d => ({[d[0]]: d[1]})));

    fs.writeFile(prefixesPath, JSON.stringify(arrayToObject), (err) => {
      if (err) {
        rej(err);
      }

      res();
    });
  });
}
