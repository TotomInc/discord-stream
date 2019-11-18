import { UserAPI, QueueAPI, GuildAPI } from '@discord-stream/models';
import { Document } from 'mongoose';
import * as express from 'express';

// TODO: find a way to add properties on Documents, such as `Document<IUser>`
declare module 'express' {
  interface Request {
    user?: Document & UserAPI.IRawUser;
    guild?: Document & GuildAPI.IRawGuild;
    queue?: Document & QueueAPI.IRawQueue;
  }
}
