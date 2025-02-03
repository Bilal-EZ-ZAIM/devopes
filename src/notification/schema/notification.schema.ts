import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User', // Référence à l'utilisateur recevant la notification
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Pharmacy', // Référence à la pharmacie de garde concernée
  })
  pharmacy: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['pharmacy-alert'], // Type spécifique pour distinguer cette notification
    default: 'pharmacy-alert',
  })
  type: string;

  @Prop({
    required: true,
    minlength: [5, 'Title must be at least 5 characters long'],
    maxlength: [100, 'Title must not exceed 100 characters'],
  })
  title: string;

  @Prop({
    required: true,
    minlength: [10, 'Message must be at least 10 characters long'],
    maxlength: [500, 'Message must not exceed 500 characters'],
  })
  message: string;

  @Prop({
    required: true,
    type: Date, // Date et heure de début de la garde
  })
  dutyStart: Date;

  @Prop({
    required: true,
    type: Date, // Date et heure de fin de la garde
  })
  dutyEnd: Date;

  @Prop({ default: false })
  isRead: boolean; 

  @Prop({ default: null })
  link: string; 

  @Prop({ default: null })
  expiresAt: Date; 



}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
