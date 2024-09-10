/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

export class CreateStockDto {
  @IsNumber()
  @IsNotEmpty()
  @MaxLength(255)
  quantity: number;
}
