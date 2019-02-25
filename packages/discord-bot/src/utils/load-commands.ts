import fs from 'fs';
import path from 'path';
import { Collection } from 'discord.js';

import { Command } from '../models';
import { LoggerService } from '../services/logger.service';

const loggerService = new LoggerService();

/**
 * Load all commands in the `commands/` folder and return a collection of
 * commands.
 */
export function loadCommands() {
  const files = fs.readdirSync(path.join(__dirname, '../commands'));
  const commands = new Collection<string, Command>();
  const errored: string[] = [];

  files.forEach((file) => {
    const command = require(`../commands/${file}`) as Command;

    if (!command) {
      errored.push(file);
      loggerService.log.error(new Error(`unable to load the command file ${file}`));
    } else {
      commands.set(command.name, command);
    }
  });

  if (errored.length >= 1) {
    loggerService.log.warn('some commands have failed to load: %s', errored.join(', '));
  } else {
    loggerService.log.info('all commands successfully loaded');
  }

  return commands;
}
