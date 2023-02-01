import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsUUID } from 'class-validator';
import mongoose, { Types } from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true })
export class ReviewModel {
  // @Prop({
  //   type: String,
  //   default: function generateUUID() {
  //     return uuidv4();
  //   },
  // })
  // _id: string;

  @Prop()
  name: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  rating: number;

  // @IsUUID()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Products' })
  productId: Types.ObjectId;
}

export const ReviewSchema = SchemaFactory.createForClass(ReviewModel);
