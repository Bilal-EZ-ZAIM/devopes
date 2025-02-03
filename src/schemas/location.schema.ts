import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Location {
  @Prop({ type: String, required: true, enum: ['Point'] })
  type: string;

  @Prop({ required: true })
  coordinates: number[];
}

export const LocationSchema = SchemaFactory.createForClass(Location);