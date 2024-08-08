/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProductDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  serviceName: string;

  @IsNotEmpty()
  servicePrice: number;

  @IsNotEmpty()
  isActive: boolean;
}
