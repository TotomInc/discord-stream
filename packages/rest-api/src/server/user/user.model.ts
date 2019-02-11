import { Typegoose, prop, staticMethod, instanceMethod, ModelType, InstanceType } from 'typegoose';

class User extends Typegoose {
  @prop({ unique: true })
  clientID!: string;

  @prop()
  username!: string;

  @staticMethod
  static getByClientID(this: ModelType<User> & typeof User, clientID: string) {
    return this.findOne({ clientID });
  }

  @instanceMethod
  updateUser(this: InstanceType<User>, user: { clientID: string, username: string }) {
    this.clientID = user.clientID;
    this.username = user.username;

    return this.save();
  }
}

export const userModel = new User().getModelForClass(User);
