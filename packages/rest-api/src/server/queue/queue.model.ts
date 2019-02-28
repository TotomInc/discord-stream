import { prop, Typegoose, staticMethod, ModelType } from 'typegoose';

import { Track } from '../../models/Track';

export class Queue extends Typegoose {
  @prop({ unique: true })
  guildID!: string;

  @prop()
  tracks?: Track[];

  /**
   * Find a queue by a Discord guild id.
   *
   * @param this this reference to the Queue model
   * @param guildID id of the guild, same as the Discord guild id
   */
  @staticMethod
  static getByGuildID(this: ModelType<Queue> & typeof Queue, guildID: string) {
    return this.findOne({ guildID });
  }
}

export const queueModel = new Queue().getModelForClass(Queue);
