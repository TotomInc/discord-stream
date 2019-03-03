import { Queue } from './queue.model';

export interface Guild {
  guildID: string;
  name: string;
  iconURL?: string;
  ownerID: string;
  region: string;
  customPrefix?: string;
  queue?: Queue;
}

export interface GuildPrefix {
  [guildID: string]: string;
}
