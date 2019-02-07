import mongoose = require('mongoose');
import bluebird from 'bluebird';

import { config } from './config/env';
import { app } from './config/express';

// Set mongoose to use bluebird as a promise plugin
mongoose.Promise = bluebird;

mongoose.connect(config.mongoURI)
  .then(() => console.log(`> Mongoose connected to: ${config.mongoURI}`));

app.listen(config.apiPort, () => console.log(`> Server started on :${config.apiPort}`));
