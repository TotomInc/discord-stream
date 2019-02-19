import dotenv from 'dotenv';
import to from 'await-to-js';

dotenv.config({
  path: require('find-config')('.env'),
});

import { config } from './config/env';
import { AuthService } from './services/auth.service';

/**
 * Bootstrap the bot:
 *
 * 1. Login to the API and generate a JWT.
 * 2. Load guild prefixes from the API.
 * 3. Login the Discord client.
 *
 * We need to use dynamic imports because services used in those imports are
 * using the `HTTPService` (which requires the `Authorized` header with a valid
 * JWT) which depends on the `AuthService`.
 */
(async () => {
  const authService = new AuthService();
  const [authErr] = await to(authService.authenticate());
  const jwt = process.env['AUTH_TOKEN'];

  if (authErr || !jwt) {
    throw new Error('Unable to generate a JWT.');
  }

  const prefixes = await import('./prefixes');
  const [prefixesErr] = await prefixes.load();

  if (prefixesErr) {
    throw new Error('Unable to load guild prefixes.');
  }

  const { client } = await import('./server');
  const [loginErr] = await client.login(config.tokens.discord);

  if (loginErr) {
    throw new Error('Unable to login to Discord servers.');
  }

  // Make sure to generate a new JWT every day so it won't expire
  const authInterval = setInterval(() => authService.authenticate(), (1000 * 60 * 60 * 24));
})();
