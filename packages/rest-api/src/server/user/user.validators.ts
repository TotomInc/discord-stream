import joi from 'joi';

export const create = {
  body: {
    clientID: joi.string().required(),
    username: joi.string().required(),
    hash: joi.string().required(),
  },
};

export const update = {
  body: {
    clientID: joi.string().required(),
    username: joi.string().required(),
    hash: joi.string().required(),
  },
};
