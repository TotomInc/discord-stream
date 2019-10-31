import { Document } from 'mongoose';

/**
 * Legacy Typegoose model to remove.
 */
export interface Favorite {
  _id: string;
  provider: string;
  url: string;
  title: string;
  description: string;
  views: string;
  thumbnailURL: string;
  duration: string;
}

/**
 * Mongoose schema of a `Favorite`.
 */
export interface IFavorite extends Document {
  provider: string;
  url: string;
  title: string;
  description: string;
  views: string;
  thumbnailURL: string;
  duration: string;
}
