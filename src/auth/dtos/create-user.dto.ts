/* eslint-disable prettier/prettier */
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  role: string;

  @IsString()
  phoneNumber: string;
}
