import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePharmacyDto } from './dto/createPharmacy';
import { Pharmacy } from 'src/schemas/pharmacy.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PharmacyServices {
  constructor(
    @InjectModel(Pharmacy.name) private pharmacyModel: Model<Pharmacy>,
  ) {}

  // Create a new pharmacy
  async createPharmacy(data: CreatePharmacyDto): Promise<Pharmacy> {
    const checkPharmacy = await this.pharmacyModel.findOne({
      email: data.email,
    });
    console.log(checkPharmacy);
    if (checkPharmacy) {
      throw new HttpException(
        'Pharmacy with this email already exists.',
        HttpStatus.CONFLICT,
      );
    }
    const pharmacy = new this.pharmacyModel(data);
    console.log(pharmacy);

    return await pharmacy.save();
  }

  // Get all pharmacies
  async getAllPharmacies(): Promise<Pharmacy[]> {
    return await this.pharmacyModel.find().exec();
  }

  // Get a pharmacy by ID
  async getPharmacyById(id: string): Promise<Pharmacy> {
    return await this.pharmacyModel.findById(id).exec();
  }

  // Update pharmacy by ID
  async updatePharmacy(
    id: string,
    updateData: Partial<Pharmacy>,
  ): Promise<Pharmacy> {
    if (updateData.email) {
      const checkPharmacy = await this.pharmacyModel.findOne({
        email: updateData.email,
      });
      if (checkPharmacy) {
        throw new HttpException(
          'Pharmacy with this email already exists.',
          HttpStatus.CONFLICT,
        );
      }
    }

    return await this.pharmacyModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  // Delete pharmacy by ID
  async deletePharmacy(id: string): Promise<boolean> {
    const result = await this.pharmacyModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  // Set pharmacy as On Duty (Harcasa)
  async setPharmacyOnDuty(id: string): Promise<Pharmacy | null> {
    const pharmacy: any = await this.pharmacyModel.findById(id).exec();
    if (!pharmacy) {
      return null;
    }
    pharmacy.isOnDuty = true; // Setting the pharmacy as On Duty
    return await pharmacy.save();
  }

  // search for pharmacies onGuard
  async findGuardPharmacies(params: {
    latitude: number;
    longitude: number;
    date?: Date;
    maxDistance?: number;
  }) {
    const {
      latitude,
      longitude,
      date = new Date(),
      maxDistance = 10000,
    } = params;

    // Création du point GeoJSON avec le type littéral "Point"
    const point = {
      type: 'Point' as const,
      coordinates: [longitude, latitude] as [number, number],
    };

    const day = date
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toLowerCase();

    return this.pharmacyModel.aggregate([
      {
        $geoNear: {
          near: point,
          distanceField: 'distance',
          maxDistance,
          spherical: true,
        },
      },
      {
        $match: {
          isOnGard: true,
        },
      },
      {
        $addFields: {
          openingHours: {
            $filter: {
              input: '$openingHours',
              as: 'hour',
              cond: { $eq: ['$$hour.day', day] },
            },
          },
        },
      },
      {
        $project: {
          name: 1,
          address: 1,
          phone: 1,
          distance: 1,
          openingHours: { $arrayElemAt: ['$openingHours', 0] },
          isOnGard: 1,
        },
      },
      {
        $sort: { distance: 1 },
      },
    ]);
  }

  // Get pharmacy details
  async getPharmacyDetails(id: string) {
    return this.pharmacyModel.findById(id).exec();
  }

  // Search for pharmacies by distance
  async searchPharmacies(params: {
    query?: string;
    latitude?: number;
    longitude?: number;
    maxDistance?: number;
  }) {
    const { query, latitude, longitude, maxDistance = 10000 } = params;

    let aggregation: any[] = [];

    if (latitude && longitude) {
      const point = {
        type: 'Point' as const,
        coordinates: [longitude, latitude] as [number, number],
      };

      aggregation.push({
        $geoNear: {
          near: point,
          distanceField: 'distance',
          maxDistance,
          spherical: true,
        },
      });
    }

    if (query) {
      aggregation.push({
        $match: {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { 'address.street': { $regex: query, $options: 'i' } },
            { 'address.city': { $regex: query, $options: 'i' } },
            { services: { $regex: query, $options: 'i' } },
          ],
        },
      });
    }

    // Si aucun critère n'est fourni, retourner toutes les pharmacies
    if (aggregation.length === 0) {
      return this.pharmacyModel.find().exec();
    }

    return this.pharmacyModel.aggregate(aggregation);
  }
  
}
