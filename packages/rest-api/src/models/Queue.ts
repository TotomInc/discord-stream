import { Document } from 'mongoose';

import { Track } from './Track';

/**
 * Legacy Typegoose model to remove.
 */
export interface Queue {
  guildID: string;
  tracks?: Track[];
}

/**
 * Mongoose schema of a `Queue`.
 */
export interface IQueue extends Document {
  guildID: string;
  tracks: Track[];
}

export interface ICreatedQueue {
  guildID: string;
  tracks: Track[];
}

export interface IUpdatedQueue {
  guildID: string;
  tracks: Track[];
}

export interface IPaginationQueue {
  limit: number;
  skip: number;
}
