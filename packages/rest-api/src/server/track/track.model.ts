import { Schema } from 'mongoose';

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
}, {
  versionKey: false,
});
