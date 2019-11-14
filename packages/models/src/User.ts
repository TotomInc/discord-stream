import { Document } from 'mongoose';

/**
 * Raw user model, should not inherit from any external module. This model is
 * used to extend the base Mongoose document.
 */
export interface IRawUser {
  clientID: string;
  username: string;
  hash: string;
  favorites: any[];
}

/**
 * A single user model when retrieving a single user from the API.
 */
export interface IUser {
  _id: string;
  clientID: string;
  username: string;
  hash: string;
  favorites: any[];
}

/**
 * A single user model when retrieving all users from the API.s
 *
 * Should be used when doing a `get-all` users call.
 *
 * When retrieving all users, the `favorites` ref is **not populated**.
 */
export interface IUsers {
  _id: IUser['_id'];
  clientID: IUser['clientID'];
  username: IUser['username'];
  hash: IUser['hash'];
}

/**
 * Mongoose document instance of a `User`.
 */
export interface IUserDocument extends Document {
  clientID: IUser['clientID'];
  username: IUser['username'];
  hash: IUser['hash'];
  favorites: IUser['favorites'];
}

/**
 * Data payload to send to the API in order to create a new user document.
 */
export interface ICreateUser {
  clientID: IUser['clientID'];
  username: IUser['username'];
  hash: IUser['hash'];
}

/**
 * Data payload to send to the API in order to update an existing user document.
 */
export interface IUpdateUser {
  clientID: IUser['clientID'];
  username: IUser['username'];
  hash: IUser['hash'];
  favorites: IUser['favorites'];
}
