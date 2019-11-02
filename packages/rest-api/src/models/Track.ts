import { Document } from 'mongoose';
import { StringSchema } from 'joi';

/**
 * Mongoose schema of a `Track`.
 */
export interface ITrack extends Document {
  provider: string;
  url: string;
  title: string;
  description: string;
  views: string;
  thumbnailURL: string;
  duration: string;
  initiator: string;
}

export interface ICreatedTrack {
  provider: ITrack['provider'];
  url: ITrack['url'];
  title: ITrack['title'];
  description: ITrack['description'];
  views: ITrack['views'];
  thumbnailURL: ITrack['thumbnailURL'];
  duration: ITrack['duration'];
  initiator: ITrack['initiator'];
}

export interface TrackSchema {
  provider: StringSchema;
  url: StringSchema;
  title: StringSchema;
  description: StringSchema;
  views: StringSchema;
  thumbnailURL: StringSchema;
  duration: StringSchema;
  initiator: StringSchema;
}
