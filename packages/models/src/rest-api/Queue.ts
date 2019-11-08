import { ITrack } from './Track';

/**
 * A single queue model when retrieving a single queue from the API.
 */
export interface IQueue {
  _id: string;
  guildID: string;
  tracks: ITrack[];
}

/**
 * A single queue model when retrieving all queues from the API. This queue
 * model is different than the `IQueue` model, be careful to use the correct
 * one.
 *
 * This one should be used when doing a `get-all` queues API call.
 */
export interface IQueues {
  _id: IQueue['_id'];
  guildID: IQueue['guildID'];
  tracks: IQueue['tracks'];
}
