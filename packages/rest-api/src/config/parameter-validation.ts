import joi from 'joi';

export default {
  auth: {
    body: {
      secret: joi.string().required(),
    },
  },
};
