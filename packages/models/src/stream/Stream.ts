import Discord from 'discord.js';

import { StreamProviders } from '../providers';

export namespace Stream {
  export interface ITrack {
    provider: StreamProviders.IProviders;
    url: string;
    streamURL: string;
    title: string;
    description: string;
    views: string;
    thumbnailURL: string;
    duration: string;
    initiator: Discord.Message;
  }
}