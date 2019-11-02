import * as express from 'express';
import { InstanceType } from 'typegoose';

import { User, IUser } from '../models/User';
import { Guild, IGuild } from '../models/Guild';
import { Queue, IQueue } from '../models/Queue';
import { Favorite } from '../models/Favorite';

declare module 'express' {
  interface Request {
    user?: InstanceType<IUser>;
    guild?: InstanceType<IGuild>;
    queue?: InstanceType<IQueue>;
    favorite?: Favorite;
  }
}
