import joi from 'joi';

import { trackSchema } from '../track/track.validators';

export const create = {
  body: {
    clientID: joi.string().required(),
    username: joi.string().required(),
    hash: joi.string().required(),
    favorites: joi.array().has(trackSchema).optional(),
  },
};

export const update = {
  body: {
    clientID: joi.string().required(),
    username: joi.string().required(),
    hash: joi.string().required(),
    favorites: joi.array().has(trackSchema).optional(),
  },
};
