import { Typegoose, prop, staticMethod, ModelType, Ref } from 'typegoose';

import { Queue } from '../queue/queue.model';

export class Guild extends Typegoose {
  @prop({ unique: true })
  guildID!: string;

  @prop({ required: true })
  name!: string;

  @prop()
  iconURL?: string;

  @prop({ required: true })
  ownerID!: string;

  @prop({ required: true })
  region!: string;

  @prop()
  customPrefix?: string;

  @prop({ ref: Queue })
  queue?: Ref<Queue>;

  @staticMethod
  static getByGuildID(this: ModelType<Guild> & typeof Guild, guildID: string) {
    return this.findOne({ guildID })
      .populate('queue');
  }
}

export const guildModel = new Guild().getModelForClass(Guild);
