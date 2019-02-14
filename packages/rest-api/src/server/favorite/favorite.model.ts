import { prop } from 'typegoose';

export class Favorite {
  @prop({ unique: true })
  _id!: string;

  @prop()
  provider!: string;

  @prop({ unique: true })
  url!: string;

  @prop()
  title!: string;

  @prop()
  description!: string;

  @prop()
  views!: string;

  @prop()
  thumbnailURL!: string;

  @prop()
  duration!: string;
}
