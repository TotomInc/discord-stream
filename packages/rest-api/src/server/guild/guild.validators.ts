import joi from 'joi';

export const create = {
  body: {
    guildID: joi.string().required(),
    name: joi.string().required(),
    iconURL: joi.string().uri().optional(),
    ownerID: joi.string().required(),
    region: joi.string().required(),
    prefix: joi.string().optional(),
    queue: joi.string().optional(),
  },
};

export const update = {
  body: {
    guildID: joi.string().required(),
    name: joi.string().required(),
    iconURL: joi.string().uri().optional(),
    ownerID: joi.string().required(),
    region: joi.string().required(),
    prefix: joi.string().optional(),
    queue: joi.string().optional(),
  },
};

export const updatePrefix = {
  body: {
    prefix: joi.string().required(),
  },
};
