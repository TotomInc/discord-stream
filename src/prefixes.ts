import Discord from 'discord.js';

import * as storedPrefixes from '../store/prefixes.json';

export const prefixes: Discord.Collection<string, string> = new Discord.Collection();

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
