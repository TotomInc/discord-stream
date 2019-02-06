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
  MONGO_PORT: joi.number().default(27017),
  INTERFACE_URI: joi.string().required(),
})
  .unknown().required();

const { error, value: vars } = joi.validate(process.env, envSchema);

if (error) {
  throw new Error(`Config validation errors: ${error.message}`);
}

export const config = {
  env: vars.NODE_ENV as string,
  apiPort: vars.API_PORT as unknown as number,
  jwtSecret: vars.JWT_SECRET as string,
  mongoURI: vars.MONGO_URI as string,
  mongoPort: vars.MONGO_PORT as unknown as number,
  interfaceURI: vars.INTERFACE_URI as string,
};
