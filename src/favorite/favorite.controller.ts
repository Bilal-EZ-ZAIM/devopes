import { Controller, Post, Delete, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('favorites')
@UseGuards(AuthGuard)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}


  @Get('addfavort/:pharmacyId')
  async ajouteFavorite(
    
    @Param('pharmacyId') pharmacyId: string,
    @Req() Req: any
  ) {
  
    return this.favoriteService.addFavorite(Req.user._id, pharmacyId);

  }


  @Delete('removefavorit/:pharmacyId')
  async deleteFavorite(
    @Param('pharmacyId') pharmacyId: string,
  @Req() Req: any
  ) {
    return this.favoriteService.removeFavorite(Req.user._id, pharmacyId);
  }


  @Get('getUserFavorit')
  async listeUserFavorites(@Req() Req: any) {
    return this.favoriteService.getUserFavorites(Req.user._id);
  }
}
