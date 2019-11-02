import * as faker from 'faker';
import { Types } from 'mongoose';

import { ICreatedUser } from '../../models/User';
import { createFakeTracks } from '../track/track.faker';

/**
 * Create a massive amount of fake users.
 *
 * @param amount amount of fake users to create
 */
export function createFakeUsers(amount: number) {
  const users: ICreatedUser[] = [];

  for (let i = 0; i < amount; i += 1) {
    const fakeTracks = createFakeTracks(Math.floor(Math.random() + 1 * 10));

    const fakeUser: ICreatedUser = {
      clientID: Types.ObjectId().toHexString(),
      username: faker.internet.userName(),
      hash: `#${Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)}`,
      favorites: [...fakeTracks],
    };

    users.push(fakeUser);
  }

  return users;
}
