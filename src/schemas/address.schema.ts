import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaFactory } from '@nestjs/mongoose';
import { Location, LocationSchema } from './location.schema';

@Schema()
export class Address {
  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  postalCode: string;

  @Prop({ required: true })
  country: string;

  @Prop({ type: LocationSchema, required: true })
  location: Location;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
