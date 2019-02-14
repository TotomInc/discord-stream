import dotenv from 'dotenv';

dotenv.config({
  path: require('find-config')('.env'),
});

import { config } from './config/env';
import * as auth from './auth';
import * as emojis from './emojis';
import { client } from './server';
import logger, { logError } from './logger';
import prefixesService from './services/prefix.service';

/**
 * 1. Authenticate the bot on the rest-api server.
 * 2. Fetch and load all prefixes from the rest-api.
 * 3. Log the Discord client.
 * 4. Load custom emojis from the "Note Bot" Discord server.
 */
auth.authenticate()
  .then((authResponse) => {
    if (!authResponse || !authResponse.token) {
      throw new Error('Unable to get a signed JWT from the auth-server');
    }

    return prefixesService.load();
  })
  .then(() => client.login(config.tokens.discord))
  .then(() => emojis.loadEmojis(client))
  .then(() => logger.log('info', 'successfully logged in'))
  .catch((err: Error) => logError(err));

/**
 * When using nodemon, before restarting the app make sure to disconnect the
 * bot from all voice channels.
 */
process.once('SIGUSR2', async () => {
  await client.voiceConnections.forEach(connection => connection.disconnect());

  process.kill(process.pid, 'SIGUSR2');
});
