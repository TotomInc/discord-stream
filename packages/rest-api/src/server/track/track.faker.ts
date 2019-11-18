import { TrackAPI } from '@discord-stream/models';
import * as faker from 'faker';

/**
 * Create a massive amount of fake tracks.
 *
 * @param amount amount of fake tracks to create
 */
export function createFakeTracks(amount: number) {
  const tracks: TrackAPI.ICreateTrack[] = [];

  for (let i = 0; i < amount; i += 1) {
    const fakeTrack: TrackAPI.ICreateTrack = {
      provider: faker.company.companyName(),
      url: faker.internet.url(),
      title: faker.lorem.words(3),
      description: faker.lorem.paragraph(),
      views: faker.random.number(1e6).toString(),
      thumbnailURL: faker.internet.url(),
      duration: faker.random.number(1e4).toString(),
      guildID: faker.random.uuid(),
      channelID: faker.random.uuid(),
      memberID: faker.random.uuid(),
    };

    tracks.push(fakeTrack);
  }

  return tracks;
}
