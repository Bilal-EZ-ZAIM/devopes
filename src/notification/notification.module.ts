import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification, NotificationSchema } from './schema/notification.schema'; // Import correct

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]), // Utilisation correcte de Notification.name
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
