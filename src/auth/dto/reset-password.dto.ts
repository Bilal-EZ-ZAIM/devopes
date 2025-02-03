import { IsString, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @IsString({ message: 'Email must be a string.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;

  @IsString({ message: 'Password must be a string.' })
  @IsNotEmpty({ message: 'Password is required.' })
  newPassword: string;
}
