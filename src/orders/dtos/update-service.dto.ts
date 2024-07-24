/* eslint-disable prettier/prettier */
import { IsEmail, IsJSON, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateServiceDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  price: number;

  @IsString()
  @IsOptional()
  status: string;
}