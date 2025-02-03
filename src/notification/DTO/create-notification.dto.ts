import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsOptional()
  pharmacyId?: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
