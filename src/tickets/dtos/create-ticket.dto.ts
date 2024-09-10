/* eslint-disable prettier/prettier */
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Priority } from '../entities/ticket.entity';

export class CreateTicketDto {
  @IsString()
  topic: string;
  @IsString()
  description: string;
  @IsNumber()
  memberId: number;
  @IsEnum(Priority)
  priority: Priority;
  @IsString()
  @IsOptional()
  file: string;
}
