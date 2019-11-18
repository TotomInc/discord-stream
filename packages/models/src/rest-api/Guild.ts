import { Document } from 'mongoose';

import { QueueAPI } from './Queue';

/**
 * Namespace for all things related to the `guild` rest-api data.
 */
export namespace GuildAPI {
  /**
   * Raw guild model, should not inherit from any external module. This model is
   * used to extend the base Mongoose document.
   */
  export interface IRawGuild {
    prefix: string;
    guildID: string;
    name: string;
    ownerID: string;
    region: string;
    iconURL?: string;
    queue?: any;
  }

  /**
   * A single guild model when retrieving a single guild from the API.
   */
  export interface IGuild {
    _id: string;
    prefix: string;
    guildID: string;
    name: string;
    ownerID: string;
    region: string;
    iconURL?: string;
    queue: QueueAPI.IQueue;
  }

  /**
   * A single guild model when retrieving all guild from the API.s
   *
   * Should be used when doing a `get-all` guild call.
   *
   * When retrieving all guild, the `queue` ref is **not populated**.
   */
  export interface IGuilds {
    _id: IGuild['_id'];
    prefix: IGuild['prefix'];
    guildID: IGuild['guildID'];
    name: IGuild['name'];
    ownerID: IGuild['ownerID'];
    region: IGuild['region'];
    iconURL?: IGuild['iconURL'];
    queue: string;
  }

  /**
   * A single guild-prefix model when retrieving all prefixes of all guilds.
   *
   * This model only contains guildID and guild prefix.
   */
  export interface IGuildPrefix {
    _id: IGuild['_id'];
    prefix: IGuild['prefix'];
    guildID: IGuild['guildID'];
  }

  /**
   * Mongoose document instance of a `Guild`.
   */
  export interface IGuildDocument extends Document {
    prefix: IGuild['prefix'];
    guildID: IGuild['guildID'];
    name: IGuild['name'];
    ownerID: IGuild['ownerID'];
    region: IGuild['region'];
    iconURL?: IGuild['iconURL'];
    /** ObjectID of the queue document reference */
    queue: string;
  }

  /**
   * Data payload to send to the API in order to create a new guild document.
   */
  export interface ICreateGuild {
    prefix: IGuild['prefix'];
    guildID: IGuild['guildID'];
    name: IGuild['name'];
    ownerID: IGuild['ownerID'];
    region: IGuild['region'];
    iconURL?: IGuild['iconURL'];
    /** ObjectID of the queue document reference */
    queue: string;
  }

  /**
   * Data payload to send to the API in order to update an existing guild
   * document.
   */
  export interface IUpdateGuild {
    prefix?: IGuild['prefix'];
    guildID: IGuild['guildID'];
    name: IGuild['name'];
    ownerID: IGuild['ownerID'];
    region: IGuild['region'];
    iconURL?: IGuild['iconURL'];
    /** ObjectID of the queue document reference */
    queue: string;
  }

  /**
   * Data payload to send to the API in order to update an existing guild prefix.
   */
  export interface IUpdateGuildPrefix {
    prefix: IGuild['prefix'];
  }
}

