import { GuildAPI } from '@discord-stream/models';
import { Types } from 'mongoose';
import * as faker from 'faker';

/**
 * Create a massive amount of fake guilds.
 *
 * @param amount amount of fake guilds to create
 */
export function createFakeGuilds(amount: number) {
  const guilds: GuildAPI.ICreateGuild[] = [];

  for (let i = 0; i < amount; i += 1) {
    const fakeGuild: GuildAPI.ICreateGuild = {
      guildID: Types.ObjectId().toHexString(),
      name: faker.internet.userName(),
      ownerID: Types.ObjectId().toHexString(),
      region: faker.address.countryCode(),
      prefix: faker.random.alphaNumeric(4),
      iconURL: Math.floor(Math.random() * 10) > 5 ? faker.image.imageUrl() : undefined,
      queue: faker.random.uuid(),
    };

    guilds.push(fakeGuild);
  }

  return guilds;
}
