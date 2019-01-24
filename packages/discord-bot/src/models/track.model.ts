import Discord from 'discord.js';
import { providers } from './providers';

export interface Track {
  provider: providers;
  url: string;
  streamURL: string;
  title: string;
  description: string;
  views: string;
  thumbnailURL: string;
  duration: string;
  initiator: Discord.Message;
}
