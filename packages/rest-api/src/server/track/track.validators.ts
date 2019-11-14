import joi from 'joi';

export const trackSchema = {
  provider: joi.string().required(),
  url: joi.string().uri().required(),
  title: joi.string().required(),
  description: joi.string().required(),
  views: joi.string().required(),
  thumbnailURL: joi.string().uri().required(),
  duration: joi.string().required(),
  initiator: joi.string().required(),
};
