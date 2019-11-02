import * as express from 'express';
import { InstanceType } from 'typegoose';

import { IUser } from '../models/User';
import { IGuild } from '../models/Guild';
import { IQueue } from '../models/Queue';

declare module 'express' {
  interface Request {
    user?: InstanceType<IUser>;
    guild?: InstanceType<IGuild>;
    queue?: InstanceType<IQueue>;
  }
}
