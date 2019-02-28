import { ObjectId } from 'bson';

import { Queue } from './Queue';

export interface Guild {
  guildID: string;
  name: string;
  iconURL?: string;
  ownerID: string;
  region: string;
  customPrefix?: string;
  queue?: Queue | ObjectId;
}
