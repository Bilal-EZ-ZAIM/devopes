import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Location, LocationSchema } from './location.schema';
import { Pharmacy } from './pharmacy.schema';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ enum: ['admin', 'user'], default: 'user' })
  role: string;

  @Prop([{ type: String, ref: 'Pharmacy' }])
  favorites: Pharmacy[];

  @Prop({ type: LocationSchema })
  lastLocation: Location;

  @Prop({ default: 'fr' })
  preferredLanguage: string;

  @Prop({ default: true })
  notificationsEnabled: boolean;

  @Prop({ default: false })
  isVerified: boolean;

}

export const UserSchema = SchemaFactory.createForClass(User);
