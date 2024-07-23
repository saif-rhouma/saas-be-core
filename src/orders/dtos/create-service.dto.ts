/* eslint-disable prettier/prettier */
import { Expose, Transform } from 'class-transformer';

export class CreateServiceDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  price: number;

  @Expose()
  status: string;
}
