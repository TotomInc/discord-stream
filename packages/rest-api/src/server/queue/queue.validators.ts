import joi from 'joi';

import { TrackSchema } from '../../models/Track';

const trackSchema: TrackSchema = {
  provider: joi.string().required(),
  url: joi.string().uri().required(),
  title: joi.string().required(),
  description: joi.string().required(),
  views: joi.string().required(),
  thumbnailURL: joi.string().uri().required(),
  duration: joi.string().required(),
  initiator: joi.string().required(),
};

export const create = {
  body: {
    guildID: joi.string().required(),
    tracks: joi.array().has(trackSchema).optional(),
  },
};

export const update = {
  body: {
    tracks: joi.array().has(trackSchema).required(),
  },
};
