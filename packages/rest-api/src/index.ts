import Express from 'express';

const port = (process.env['PORT'] as number | undefined) || 8080;

export const app = Express();
export const router = Express.Router();

app.listen(port);
console.log(`> REST API server up at :${port}`);
