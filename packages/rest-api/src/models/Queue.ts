import { Document } from 'mongoose';

import { ITrack } from './Track';

/**
 * Mongoose schema of a `Queue`.
 */
export interface IQueue extends Document {
  guildID: string;
  tracks: ITrack[];
}

export interface ICreatedQueue {
  guildID: IQueue['guildID'];
  tracks: IQueue['tracks'];
}

export interface IUpdatedQueue {
  guildID: IQueue['guildID'];
  tracks: IQueue['tracks'];
}

export interface IPaginationQueue {
  limit: number;
  skip: number;
}
