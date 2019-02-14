import { Typegoose, prop, staticMethod, ModelType } from 'typegoose';

import { Favorite } from '../favorite/favorite.model';

class User extends Typegoose {
  @prop({ unique: true })
  clientID!: string;

  @prop()
  username!: string;

  @prop({ default: [] })
  favorites!: Favorite[];

  @staticMethod
  static getByClientID(this: ModelType<User> & typeof User, clientID: string) {
    return this.findOne({ clientID });
  }
}

export const userModel = new User().getModelForClass(User);
