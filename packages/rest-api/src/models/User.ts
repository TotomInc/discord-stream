import { Document } from 'mongoose';

import { ITrack, ICreatedTrack } from './Track';

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
  favorites?: ICreatedTrack[];
}

export interface IUpdatedUser {
  clientID: IUser['clientID'];
  username: IUser['username'];
  hash: IUser['hash'];
  favorites?: ICreatedTrack[];
}

export interface IPaginationUser {
  limit: number;
  skip: number;
  max: boolean;
}
