import { ITrack } from './Track';

/**
 * A single user model when retrieving a single user from the API.
 */
export interface IUser {
  _id: string;
  clientID: string;
  username: string;
  hash: string;
  favorites: ITrack[];
}

/**
 * A single user model when retrieving all users from the API. This user model
 * is different than the `IUser` model, be careful to use the correct one.
 *
 * This one should be used when doing a `get-all` users API call.
 */
export interface IUsers {
  _id: IUser['_id'];
  clientID: IUser['clientID'];
  username: IUser['username'];
  hash: IUser['hash'];
}
