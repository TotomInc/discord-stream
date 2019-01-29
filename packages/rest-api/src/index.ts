import dotenv from 'dotenv';
import Express from 'express';
import jwt from 'express-jwt';

import * as utils from './utils';

dotenv.config({
  path: require('find-config')('.env'),
});

import { PrefixesRoutes } from './prefixes';
import { AuthRoutes } from './auth';

const port = (process.env['PORT'] as number | undefined) || 8080;
const JWT_SECRET = process.env['JWT_SECRET'];

export const app = Express();
export const router = Express.Router();

if (!JWT_SECRET) {
  throw new Error('The JWT_SECRET environment variable must be set in the .env file');
}

const jwtOptions: jwt.Options = {
  secret: JWT_SECRET,
};
const jwtPathsExclusion = ['/', '/api/auth'];

app.use(jwt(jwtOptions).unless({ path: jwtPathsExclusion }));
app.use(utils.unauthorizedNext);

app.get('/', (req, res) => res.status(404).end());

app.use('/api/prefixes', PrefixesRoutes);
app.use('/api/auth', AuthRoutes);

app.listen(port);

console.log(`> REST API server up at :${port}`);
