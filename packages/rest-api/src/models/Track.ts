import { Document } from 'mongoose';
import { StringSchema } from 'joi';

/**
 * Legacy Typegoose model.
 */
export interface Track {
  provider: string;
  url: string;
  title: string;
  description: string;
  views: string;
  thumbnailURL: string;
  duration: string;
  initiator: string;
}

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
