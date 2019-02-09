import joi from 'joi';

export default {
  auth: {
    body: {
      secret: joi.string().required(),
    },
  },

  oauthCallback: {
    query: {
      code: joi.string().required(),
    },
  },

  newUser: {
    body: {
      clientID: joi.string().required(),
      username: joi.string().required(),
    },
  },
};
