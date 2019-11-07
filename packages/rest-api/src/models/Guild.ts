import { ObjectId } from 'bson';
import { Document } from 'mongoose';

/**
 * Mongoose schema of a `Guild`.
 */
export interface IGuild extends Document {
  guildID: string;
  name: string;
  iconURL?: string;
  ownerID: string;
  region: string;
  prefix: string;
  queue: ObjectId;
}

export interface ICreatedGuild {
  guildID: IGuild['guildID'];
  name: IGuild['name'];
  iconURL?: IGuild['iconURL'];
  ownerID: IGuild['ownerID'];
  region: IGuild['region'];
  prefix?: IGuild['prefix'];
  queue?: IGuild['queue'];
}

export interface IUpdatedGuild {
  guildID: IGuild['guildID'];
  name: IGuild['name'];
  iconURL?: IGuild['iconURL'];
  ownerID: IGuild['ownerID'];
  region: IGuild['region'];
  prefix?: IGuild['prefix'];
  queue: IGuild['queue'];
}

export interface IPaginationGuild {
  limit: number;
  skip: number;
  max: boolean;
}
