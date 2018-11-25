import dotenv from 'dotenv';
import Debug from 'debug';

import * as prefixes from './prefixes';
import { client } from './server';

dotenv.config();

const debug = Debug('streamer:index');
const token = process.env['DISCORD_TOKEN'];

prefixes.loadPrefixes()
  .then(() => client.login(token))
  .then(() => debug('successfully logged in'))
  .catch((err: Error) => {
    debug('could not log in: %s', err.message);
    debug('token used: %s', token);
  });

/**
 * When using nodemon, before restarting the app make sure to disconnect the
 * bot from all the voice channels.
 */
process.once('SIGUSR2', async () => {
  await client.voiceConnections.forEach((connection) => connection.disconnect());
  process.kill(process.pid, 'SIGUSR2');
});
