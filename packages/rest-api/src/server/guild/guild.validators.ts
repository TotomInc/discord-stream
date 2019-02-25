import joi from 'joi';

export const create = {
  body: {
    guildID: joi.string().required(),
    name: joi.string().required(),
    iconURL: joi.string().uri().optional(),
    ownerID: joi.string().required(),
    region: joi.string().required(),
    customPrefix: joi.string().optional(),
  },
};

export const update = {
  body: {
    guildID: joi.string().required(),
    name: joi.string().required(),
    iconURL: joi.string().uri().optional(),
    ownerID: joi.string().required(),
    region: joi.string().required(),
    customPrefix: joi.string().optional(),
  },
};

export const updatePrefix = {
  body: {
    customPrefix: joi.string().required(),
  },
};
