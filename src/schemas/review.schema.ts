import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Pharmacy } from './pharmacy.schema';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Review extends Document {
  @Prop({ type: String, ref: 'Pharmacy', required: true })
  pharmacyId: Pharmacy;

  @Prop({ type: String, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop()
  comment: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
