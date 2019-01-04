import Discord from 'discord.js';

export interface Command {
  name: string;
  description: string;
  invisible?: boolean;
  execute: (message: Discord.Message, args: string[]) => any;
}
