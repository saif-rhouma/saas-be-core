/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import { IsDate, IsNumber } from 'class-validator';

export class UpdatePlanDto {
  @IsDate()
  @Type(() => Date)
  planDate: Date;
  @IsNumber()
  quantity: number;
}
