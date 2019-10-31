import * as express from 'express';
import { InstanceType } from 'typegoose';

import { User, IUser } from '../models/User';
import { Guild } from '../models/Guild';
import { Queue } from '../models/Queue';
import { Favorite } from '../models/Favorite';

declare module 'express' {
  interface Request {
    user?: InstanceType<IUser>;
    guild?: InstanceType<Guild>;
    queue?: InstanceType<Queue>;
    favorite?: Favorite;
  }
}
