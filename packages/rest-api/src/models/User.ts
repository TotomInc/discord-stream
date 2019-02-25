import { Favorite } from './Favorite';

export interface User {
  clientID: string;
  username: string;
  favorites: Favorite[];
}
