import dotenv from 'dotenv';
import * as joi from 'joi';

dotenv.config({
  path: require('find-config')('.env'),
});

// Validate the environment variables schema, this ensures we don't have some
// undefined variables.
const envSchema = joi.object({
  NODE_ENV: joi.string()
    .allow(['development', 'production', 'test'])
    .default('development'),
  API_PORT: joi.number().default(4000),
  JWT_SECRET: joi.string().required(),
  MONGO_URI: joi.string().required(),
  INTERFACE_URI: joi.string().required(),
  OWNER_USER_ID: joi.number().unsafe().required(),
  BOT_USER_ID: joi.number().unsafe().required(),
  DEFAULT_PREFIX: joi.string().required(),
  DISCORD_TOKEN: joi.string().required(),
  DISCORD_SECRET: joi.string().required(),
  YOUTUBE_TOKEN: joi.string().required(),
  SOUNDCLOUD_TOKEN: joi.string().required(),
})
  .unknown().required();

const { error, value: vars } = joi.validate(process.env, envSchema);

if (error) {
  throw new Error(`Config validation errors: ${error.message}`);
}

export const config = {
  tokens: {
    discord: vars.DISCORD_TOKEN as string,
    youtube: vars.YOUTUBE_TOKEN as string,
    soundcloud: vars.SOUNDCLOUD_TOKEN as string,
  },

  secrets: {
    jwt: vars.JWT_SECRET as string,
    discord: vars.DISCORD_SECRET as string,
  },

  bot: {
    prefix: vars.DEFAULT_PREFIX as string,
    userID: vars.USER_ID as unknown as number,
    ownerUserID: vars.OWNER_USER_ID as unknown as number,
  },

  env: vars.NODE_ENV as string,
  apiPort: vars.API_PORT as unknown as number,
  mongoURI: vars.MONGO_URI as string,
  interfaceURI: vars.INTERFACE_URI as string,
};
