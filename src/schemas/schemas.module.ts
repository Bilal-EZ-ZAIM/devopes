import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { Pharmacy, PharmacySchema } from './pharmacy.schema';
import { Review, ReviewSchema } from './review.schema';
import { Notification, NotificationSchema } from '../notification/schema/notification.schema';
import { DatabaseSeeder } from '../database.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Pharmacy.name, schema: PharmacySchema },
      { name: Review.name, schema: ReviewSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  providers: [DatabaseSeeder],
  exports: [DatabaseSeeder],
})
export class SchemasModule {}
