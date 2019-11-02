import { Document } from 'mongoose';
import { ITrack } from './Track';

/**
 * Legacy Typegoose model to remove.
 */
export interface User {
  clientID: string;
  username: string;
}

/**
 * Mongoose schema of a `User`.
 */
export interface IUser extends Document {
  clientID: string;
  username: string;
  hash: string;
  favorites: ITrack[];
}

export interface ICreatedUser {
  clientID: IUser['clientID'];
  username: IUser['username'];
  hash: IUser['hash'];
  favorites?: IUser['favorites'];
}

export interface IUpdatedUser {
  clientID: IUser['clientID'];
  username: IUser['username'];
  hash: IUser['hash'];
  favorites?: IUser['favorites'];
}

export interface IPaginationUser {
  limit: number;
  skip: number;
}
