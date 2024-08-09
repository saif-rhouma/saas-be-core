/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto {
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  orderDate: Date;

  @IsBoolean()
  @IsOptional()
  isHidden: boolean;

  @IsString()
  @IsOptional()
  status: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  deliveryDate: Date;
}
