import joi from 'joi';

export const create = {
  body: {
    provider: joi.string().required(),
    url: joi.string().required(),
    title: joi.string().required(),
    description: joi.string().required(),
    views: joi.string().required(),
    thumbnailURL: joi.string().required(),
    duration: joi.string().required(),
  },
};

export const update = create;
