import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class FavoriteService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

 
  async addFavorite(userId: string, pharmacyId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

   
    if (user.favorites.includes(pharmacyId)) {
      throw new BadRequestException('Pharmacy already in favorites');
    }

    user.favorites.push(pharmacyId); 
    return user.save();
  }

  
  async removeFavorite(userId: string, pharmacyId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

   
    user.favorites = user.favorites.filter((id) => id !== pharmacyId);
    return user.save();
  }

  
  async getUserFavorites(userId: string): Promise<User> {
    return this.userModel.findById(userId).populate('favorites').exec();
  }
}
