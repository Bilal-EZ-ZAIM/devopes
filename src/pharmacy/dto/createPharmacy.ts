import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsEmail,
} from 'class-validator';

export class CreatePharmacyDto {
  @IsString({ message: 'Pharmacy name must be a string.' })
  @IsNotEmpty({ message: 'Pharmacy name is required.' })
  name: string;

  @IsString({ message: 'Phone number must be a string.' })
  @IsNotEmpty({ message: 'Phone number is required.' })
  phone: string;

  @IsString({ message: 'City name must be a string.' })
  @IsNotEmpty({ message: 'City is required.' })
  city: string;

  @IsNotEmpty({ message: 'Latitude is required.' })
  latitude: number;

  @IsNotEmpty({ message: 'Longitude is required.' })
  longitude: number;

  @IsString({ message: 'Detailed address must be a string.' })
  @IsNotEmpty({ message: 'Detailed address is required.' })
  detailedAddress: string;

  @IsEmail({}, { message: 'Invalid email format.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;
  @IsOptional()
  @IsNotEmpty({ message: 'isOnDuty is required.' })
  isOnDuty: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Image is expected as a string (URL or base64).' })
  image?: string;

  @IsOptional()
  @IsString({ message: 'Image is expected as a string (URL or base64).' })
  imageMobile?: string;
}
