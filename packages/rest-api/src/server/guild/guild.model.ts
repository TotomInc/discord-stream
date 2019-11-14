import { IGuildDocument } from '@discord-stream/models';
import mongoose, { Schema } from 'mongoose';

export const GuildSchema: Schema = new Schema({
  guildID: {
    type: Schema.Types.String,
    required: true,
    unique: true,
  },

  name: {
    type: Schema.Types.String,
    required: true,
  },

  iconURL: {
    type: Schema.Types.String,
    required: false,
  },

  ownerID: {
    type: Schema.Types.String,
    required: true,
  },

  region: {
    type: Schema.Types.String,
    required: true,
  },

  prefix: {
    type: Schema.Types.String,
    required: false,
    default: '=note',
  },

  queue: {
    type: Schema.Types.ObjectId,
    ref: 'Queue',
    required: true,
  },
}, {
  versionKey: false,
});

export const GuildModel = mongoose.model<IGuildDocument>('Guild', GuildSchema);
