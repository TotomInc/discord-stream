import * as express from 'express';
import { InstanceType } from 'typegoose';

import { User } from '../models/User';
import { Guild } from '../models/Guild';

declare module 'express' {
  interface Request {
    user?: InstanceType<User>;
    guild?: InstanceType<Guild>;
  }
}
