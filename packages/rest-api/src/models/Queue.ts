import { Track } from './Track';

export interface Queue {
  guildID: string;
  tracks?: Track[];
}
