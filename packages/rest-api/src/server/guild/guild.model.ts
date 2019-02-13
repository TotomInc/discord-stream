import { Typegoose, prop, staticMethod, ModelType } from 'typegoose';

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

  @staticMethod
  static getByGuildID(this: ModelType<Guild> & typeof Guild, guildID: string) {
    return this.findOne({ guildID });
  }
}

export const guildModel = new Guild().getModelForClass(Guild);
