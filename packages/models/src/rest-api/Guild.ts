import { IQueue } from './Queue';

/**
 * A single guild retrieved from the API.
 */
export interface IGuild {
  _id: string;
  prefix: string;
  guildID: string;
  name: string;
  ownerID: string;
  region: string;
  iconURL?: string;
  queue: IQueue;
}

/**
 * A single guild model when retrieving all guilds from the API. This guild model
 * is different than the `IGuild` model, be careful to use the correct one.
 *
 * This one should be used when doing a `get-all` guilds API call.
 */
export interface IGuilds {
  _id: IGuild['_id'];
  prefix: IGuild['prefix'];
  guildID: IGuild['guildID'];
  name: IGuild['name'];
  ownerID: IGuild['ownerID'];
  region: IGuild['region'];
  iconURL?: IGuild['iconURL'];
  queue: IGuild['queue'];
}
