import * as faker from 'faker';
import { Types } from 'mongoose';

import { ICreatedUser } from '../../models/User';

/**
 * Create a massive amount of fake users.
 *
 * @param amount amount of fake users to create
 */
export function createFakeUsers(amount: number) {
  const users: ICreatedUser[] = [];

  for (let i = 0; i < amount; i += 1) {
    const fakeUser: ICreatedUser = {
      clientID: Types.ObjectId().toHexString(),
      username: faker.name.firstName(),
      hash: `#${Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)}`,
    };

    users.push(fakeUser);
  }

  return users;
}
