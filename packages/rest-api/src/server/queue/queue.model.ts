import mongoose, { Schema } from 'mongoose';

import { IQueue } from '../../models/Queue';

export const TrackSchema: Schema = new Schema({
  provider: {
    type: Schema.Types.String,
    required: true,
  },

  url: {
    type: Schema.Types.String,
    required: true,
  },

  title: {
    type: Schema.Types.String,
    required: true,
  },

  description: {
    type: Schema.Types.String,
    required: true,
  },

  views: {
    type: Schema.Types.String,
    required: true,
  },

  thumbnailURL: {
    type: Schema.Types.String,
    required: true,
  },

  duration: {
    type: Schema.Types.String,
    required: true,
  },

  initiator: {
    type: Schema.Types.String,
    required: true,
  },
});

export const QueueSchema: Schema = new Schema({
  guildID: {
    type: Schema.Types.String,
    required: true,
    unique: true,
  },

  tracks: [TrackSchema],
});

export const QueueModel = mongoose.model<IQueue>('Queue', QueueSchema);
