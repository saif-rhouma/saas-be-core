/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  price: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsNotEmpty()
  isActive: boolean;
}
