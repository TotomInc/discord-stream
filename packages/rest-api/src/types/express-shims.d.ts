import * as express from 'express';
import { InstanceType } from 'typegoose';

import { User } from '../models/User';

declare module 'express' {
  interface Request {
    user?: InstanceType<User>;
  }
}
