import joi from 'joi';

import { trackSchema } from '../track/track.validators';

export const create = {
  body: {
    guildID: joi.string().required(),
  },
};

export const update = {
  body: {
    tracks: joi.array().has(trackSchema).required(),
  },
};
