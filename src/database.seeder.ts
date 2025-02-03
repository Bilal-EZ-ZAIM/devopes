import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { Pharmacy } from './schemas/pharmacy.schema';
import { Review } from './schemas/review.schema';
import { Notification } from './notification/schema/notification.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class DatabaseSeeder {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Pharmacy.name) private pharmacyModel: Model<Pharmacy>,
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {}

  async seed() {
    await this.clearDatabase();
    const users = await this.seedUsers();
    const pharmacies = await this.seedPharmacies();
    await this.seedReviews(users, pharmacies);
    await this.seedNotifications(users, pharmacies);
    console.log('Database seeded successfully!');
  }

  private async clearDatabase() {
    await this.userModel.deleteMany({});
    await this.pharmacyModel.deleteMany({});
    await this.reviewModel.deleteMany({});
    await this.notificationModel.deleteMany({});
  }

  private async seedUsers(): Promise<User[]> {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await this.userModel.create([
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
        lastLocation: {
          type: 'Point',
          coordinates: [2.3522, 48.8566], // Paris coordinates
        },
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'user',
        isVerified: true,
        lastLocation: {
          type: 'Point',
          coordinates: [2.3522, 48.8566],
        },
      },
    ]);

    return users;
  }

  private async seedPharmacies(): Promise<Pharmacy[]> {
    const pharmacies = await this.pharmacyModel.create([
      {
        name: 'Pharmacie Centrale',
        address: {
          street: '123 Rue de la Paix',
          city: 'Youssoufia',
          postalCode: '46000', // Example postal code for Youssoufia
          country: 'Morocco',
          location: {
            type: 'Point',
            coordinates: [-8.5298, 32.2462], // Example coordinates for Youssoufia
          },
        },
        phone: '+212123456789', // Updated to Morocco phone format
        email: 'centrale@pharmacy.com',
        openingHours: [
          { day: 'Monday', open: '09:00', close: '19:00' },
          { day: 'Tuesday', open: '09:00', close: '19:00' },
          { day: 'Wednesday', open: '09:00', close: '19:00' },
          { day: 'Thursday', open: '09:00', close: '19:00' },
          { day: 'Friday', open: '09:00', close: '19:00' },
          { day: 'Saturday', open: '09:00', close: '19:00' },
          { day: 'Sunday', open: '10:00', close: '13:00' },
        ],
        services: ['Vaccination', 'Blood Pressure Test', 'Diabetes Screening'],
        isOnGard: false,
      },
      {
        name: 'Pharmacie du Marché',
        address: {
          street: '45 Avenue des Champs-Élysées',
          city: 'Youssoufia',
          postalCode: '46000',
          country: 'Morocco',
          location: {
            type: 'Point',
            coordinates: [-8.5298, 32.2462], // Same as above for Youssoufia
          },
        },
        phone: '+212987654321', // Updated to Morocco phone format
        email: 'marche@pharmacy.com',
        openingHours: [
          { day: 'Monday', open: '08:00', close: '20:00' },
          { day: 'Tuesday', open: '08:00', close: '20:00' },
          { day: 'Wednesday', open: '08:00', close: '20:00' },
          { day: 'Thursday', open: '08:00', close: '20:00' },
          { day: 'Friday', open: '08:00', close: '20:00' },
          { day: 'Saturday', open: '09:00', close: '17:00' },
          { day: 'Sunday', open: '10:00', close: '13:00' },
        ],
        services: ['24/7 Service', 'Vaccination', 'Medical Devices'],
        isOnGard: true,
      },
    ]);

    return pharmacies;
  }

  private async seedReviews(users: User[], pharmacies: Pharmacy[]) {
    await this.reviewModel.create([
      {
        pharmacyId: pharmacies[0]._id,
        userId: users[1]._id,
        rating: 4,
        comment: 'Great service and friendly staff!',
      },
      {
        pharmacyId: pharmacies[1]._id,
        userId: users[1]._id,
        rating: 5,
        comment: 'Very convenient location and extended hours.',
      },
    ]);
  }

  private async seedNotifications(users: User[], pharmacies: Pharmacy[]) {
    await this.notificationModel.create([
      {
        userId: users[1]._id,
        pharmacyId: pharmacies[0]._id,
        message: 'Your prescription is ready for pickup',
        isRead: false,
      },
      {
        userId: users[1]._id,
        message:
          'Welcome to PharmaDirect! Complete your profile to get personalized recommendations.',
        isRead: true,
      },
    ]);
  }
}
