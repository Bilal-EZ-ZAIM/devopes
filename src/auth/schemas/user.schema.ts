import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Pharmacy } from 'src/schemas/pharmacy.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: [true, 'Username is required'],
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username must not exceed 20 characters'],
  })
  username: string;

  @Prop({
    required: [true, 'Email is required'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
  })
  email: string;

  @Prop({
    required: [true, 'Password is required'],
  })
  password: string;

  @Prop({
    enum: {
      values: ['admin', 'user'],
      message: 'Role must be either "admin" or "user"',
    },
    default: 'user',
  })
  role: string;

  @Prop({ default: 'fr' })
  preferredLanguage: string;

  @Prop({ default: true })
  notificationsEnabled: boolean;

  @Prop({ type: [{ type: String, ref: 'Pharmacy' }], default: [] })
  favorites: string[]; 
  
}

export const UserSchema = SchemaFactory.createForClass(User);
