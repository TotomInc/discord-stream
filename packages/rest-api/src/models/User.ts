import { Document } from 'mongoose';

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
