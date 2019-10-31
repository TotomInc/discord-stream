import { Document } from 'mongoose';

import { Favorite, IFavorite } from './Favorite';

/**
 * Legacy Typegoose model to remove.
 */
export interface User {
  clientID: string;
  username: string;
  favorites: Favorite[];
}

/**
 * Mongoose schema of a `User`.
 */
export interface IUser extends Document {
  clientID: string;
  username: string;
  hash: string;
  favorites: IFavorite['_id'][];
}

export interface ICreatedUser {
  clientID: IUser['clientID'];
  username: IUser['username'];
  hash: IUser['hash'];
}

export interface IUpdatedUser {
  clientID: IUser['clientID'];
  username: IUser['username'];
  hash: IUser['hash'];
}

export interface IPaginationUser {
  limit: number;
  skip: number;
}
