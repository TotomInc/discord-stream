import { Document } from 'mongoose';

import { TrackAPI } from './Track';

/**
 * Namespace for all things related to the `queue` rest-api data.
 */
export namespace QueueAPI {
  /**
   * Raw queue model, should not inherit from any external module. This model is
   * used to extend the base Mongoose document.
   */
  export interface IRawQueue {
    guildID: string;
    tracks: TrackAPI.ITrack[];
  }

  /**
   * A single queue model when retrieving a single queue from the API.
   */
  export interface IQueue {
    _id: string;
    guildID: string;
    tracks: TrackAPI.ITrack[];
  }

  /**
   * A single queue model when retrieving all queues from the API. This queue
   * model is different than the `IQueue` model, be careful to use the correct
   * one.
   *
   * This one should be used when doing a `get-all` queues API call.
   */
  export interface IQueues {
    _id: IQueue["_id"];
    guildID: IQueue["guildID"];
    tracks: IQueue["tracks"];
  }

  /**
   * Mongoose document instance of a `Queue`.
   */
  export interface IQueueDocument extends Document {
    guildID: IQueue["guildID"];
    tracks: IQueue["tracks"];
  }

  /**
   * Data payload to send to the API in order to create a new user document.
   */
  export interface ICreateQueue {
    guildID: IQueue["guildID"];
  }

  /**
   * Data payload to send to the API in order to update an existing user document.
   */
  export interface IUpdateQueue {
    guildID: IQueue["guildID"];
    tracks: IQueue["tracks"];
  }
}
