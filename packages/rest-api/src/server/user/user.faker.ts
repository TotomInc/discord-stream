import { UserAPI } from '@discord-stream/models';
import { Types } from 'mongoose';
import * as faker from 'faker';

/**
 * Create a massive amount of fake users.
 *
 * @param amount amount of fake users to create
 */
export function createFakeUsers(amount: number) {
  const users: UserAPI.ICreateUser[] = [];

  for (let i = 0; i < amount; i += 1) {
    const fakeUser: UserAPI.ICreateUser = {
      clientID: Types.ObjectId().toHexString(),
      username: faker.internet.userName(),
      hash: `#${Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)}`,
    };

    users.push(fakeUser);
  }

  return users;
}
