import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
export type PharmacyDocument = HydratedDocument<Pharmacy>;

@Schema({ timestamps: true })
export class Pharmacy extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  imageMobile: string;

  @Prop({ required: true })
  latitude: number; // Latitude from Google Maps

  @Prop({ required: true })
  longitude: number; // Longitude from Google Maps

  @Prop({ required: true })
  detailedAddress: string; // Full address fetched from Google Maps API

  @Prop({ required: true, unique: true })
  email: string; // Email address of the pharmacy

  @Prop({ required: true, default: false })
  isOnDuty: boolean; // Indicates if the pharmacy is on duty

  @Prop({ required: false })
  description?: string; // Optional description for the pharmacy

  @Prop({ default: false })
  isOnGard: boolean;
}

export const PharmacySchema = SchemaFactory.createForClass(Pharmacy);
PharmacySchema.index({ 'address.location': '2dsphere' });
