import Express from 'express';

import { PrefixesRoutes } from './prefixes';

const port = (process.env['PORT'] as number | undefined) || 8080;

export const app = Express();
export const router = Express.Router();

app.get('/', (req, res) => res.status(400).end());

app.use('/api/prefixes', PrefixesRoutes);

app.listen(port);
console.log(`> REST API server up at :${port}`);
