import { Document } from 'mongoose';

export namespace TrackAPI {
  /**
   * Raw track model, should not inherit from any external module. This model is
   * used to extend the base Mongoose document.
   */
  export interface IRawTrack {
    provider: string;
    url: string;
    title: string;
    description: string;
    views: string;
    thumbnailURL: string;
    duration: string;
    guildID: string;
    channelID: string;
    memberID: string;
  }

  /**
   * A single track model when retrieving tracks of a user's favorites, guild queue, ...
   */
  export interface ITrack {
    _id: string;
    provider: string;
    url: string;
    title: string;
    description: string;
    views: string;
    thumbnailURL: string;
    duration: string;
    guildID: string;
    channelID: string;
    memberID: string;
  }

  /**
   * **DEPRECATED**
   *
   * A single track model when retrieving tracks of a user's favorites, guild queue, ...
   */
  export interface IOldTrack {
    _id: string;
    provider: string;
    url: string;
    title: string;
    description: string;
    views: string;
    thumbnailURL: string;
    duration: string;
    initiator: string;
  }

  /**
   * Mongoose document instance of a `Track`.
   */
  export interface ITrackDocument extends Document {
    provider: ITrack["provider"];
    url: ITrack["url"];
    title: ITrack["title"];
    description: ITrack["description"];
    views: ITrack["views"];
    thumbnailURL: ITrack["thumbnailURL"];
    duration: ITrack["duration"];
    guildID: ITrack["guildID"];
    channelID: ITrack["channelID"];
    memberID: ITrack["memberID"];
  }

  /**
   * Data payload to send to the API in order to create a new track document.
   */
  export interface ICreateTrack {
    provider: ITrack["provider"];
    url: ITrack["url"];
    title: ITrack["title"];
    description: ITrack["description"];
    views: ITrack["views"];
    thumbnailURL: ITrack["thumbnailURL"];
    duration: ITrack["duration"];
    guildID: ITrack["guildID"];
    channelID: ITrack["channelID"];
    memberID: ITrack["memberID"];
  }
}
