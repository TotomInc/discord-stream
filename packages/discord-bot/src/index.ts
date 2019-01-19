import dotenv from 'dotenv';

import * as prefixes from './prefixes';
import { client } from './server';
import logger from './logger';

dotenv.config({
  path: require('find-config')('.env'),
});

const token = process.env['DISCORD_TOKEN'];

prefixes.loadPrefixes()
  .then(() => client.login(token))
  .then(() => logger.log('info', 'successfully logged in'))
  .catch((err: Error) => logger.log('error', `${err.message}`));

/**
 * When using nodemon, before restarting the app make sure to disconnect the
 * bot from all the voice channels.
 */
process.once('SIGUSR2', async () => {
  await client.voiceConnections.forEach((connection) => connection.disconnect());
  process.kill(process.pid, 'SIGUSR2');
});
