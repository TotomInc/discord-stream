import fs from 'fs';
import path from 'path';
import { Collection } from 'discord.js';

import { Command } from '../models';

/**
 * Load all commands in the `commands/` folder and return a collection of
 * commands.
 */
export function loadCommands() {
  const files = fs.readdirSync(path.join(__dirname, '/commands'));
  const commands = new Collection<string, Command>();

  files.forEach((file) => {
    const command = require(`./commands/${file}`) as Command;

    commands.set(command.name, command);
  });

  return commands;
}