import * as faker from 'faker';
import { Types } from 'mongoose';

import { ICreatedGuild } from '../../models/Guild';

/**
 * Create a massive amount of fake guilds.
 *
 * @param amount amount of fake guilds to create
 */
export function createFakeGuilds(amount: number) {
  const guilds: ICreatedGuild[] = [];

  for (let i = 0; i < amount; i += 1) {
    const fakeGuild: ICreatedGuild = {
      guildID: Types.ObjectId().toHexString(),
      name: faker.internet.userName(),
      ownerID: Types.ObjectId().toHexString(),
      region: faker.address.countryCode(),
      prefix: Math.floor(Math.random() * 10) > 5 ? faker.random.word() : undefined,
      iconURL: Math.floor(Math.random() * 10) > 5 ? faker.image.imageUrl() : undefined,
    };

    guilds.push(fakeGuild);
  }

  return guilds;
}
