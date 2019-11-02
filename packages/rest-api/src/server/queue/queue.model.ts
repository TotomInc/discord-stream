import mongoose, { Schema } from 'mongoose';

import { IQueue } from '../../models/Queue';
import { TrackSchema } from '../track/track.model';

export const QueueSchema: Schema = new Schema({
  guildID: {
    type: Schema.Types.String,
    required: true,
    unique: true,
  },

  tracks: [TrackSchema],
}, {
  versionKey: false,
});

export const QueueModel = mongoose.model<IQueue>('Queue', QueueSchema);
