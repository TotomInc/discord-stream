import mongoose, { Schema } from 'mongoose';

import { IUser } from '../../models/User';

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

  favorites: [{
    type: Schema.Types.String,
    ref: 'Favorite',
  }],
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);
