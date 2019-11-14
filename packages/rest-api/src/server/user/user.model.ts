import { IUserDocument } from '@discord-stream/models';
import mongoose, { Schema } from 'mongoose';

import { TrackSchema } from '../track/track.model';

export const UserSchema: Schema = new Schema({
  clientID: {
    type: Schema.Types.String,
    required: true,
    unique: true,
  },

  username: {
    type: Schema.Types.String,
    required: true,
  },

  hash: {
    type: Schema.Types.String,
    required: true,
  },

  favorites: [TrackSchema],
}, {
  versionKey: false,
});

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
