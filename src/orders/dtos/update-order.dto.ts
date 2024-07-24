/* eslint-disable prettier/prettier */
import { IsEmail, IsJSON, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';


export class updateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  phoneNumber: number;

  @IsString()
  @IsOptional()
  accountType: string;
}