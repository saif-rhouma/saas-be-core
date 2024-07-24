/* eslint-disable prettier/prettier */
import { IsEmail, IsJSON, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCustomerDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsEmail()
  @IsOptional()
  name: string;

  //@Expose()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //@Transform(({ value, obj }) => obj.roles.map((Order) => Order.name))
  //orders: string[];

  @IsEmail()
  @IsOptional()
  city: string;

  @IsEmail()
  @IsOptional()
  phoneNumber: number;

  @IsEmail()
  @IsOptional()
  taxNumber: number;

  @IsEmail()
  @IsOptional()
  Address: string;

  @IsEmail()
  @IsOptional()
  isActive: string;
}