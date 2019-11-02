import joi from 'joi';

import { trackSchema } from '../track/track.validators';

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
