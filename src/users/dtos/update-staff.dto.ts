/* eslint-disable prettier/prettier */
import { IsBoolean, IsEmail, IsJSON, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateStaffDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsJSON()
  @IsOptional()
  applicationThemeSetting;

  @IsJSON()
  @IsOptional()
  address;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsString()
  @IsOptional()
  avatar: string;
}
