import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class UserModel {
  @Prop({ unique: true })
  email: string;

  @Prop()
  passwordHash: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
