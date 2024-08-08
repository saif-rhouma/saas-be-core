/* eslint-disable prettier/prettier */
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  printerPOS;

  @IsString()
  currencySymbol;

  @IsNumber()
  taxPercentage;

  //   @IsString()
  //   appLogo: string;

  //   @IsString()
  //   favicon: string;

  // Other Attribute will be ADDED!
}
