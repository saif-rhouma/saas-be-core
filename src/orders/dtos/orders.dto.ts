/* eslint-disable prettier/prettier */
import { Expose, Transform } from 'class-transformer';
export class OrderDto {
  @Expose()
  id: number;

  @Expose()
  color: string;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Transform(({ value, obj }) => obj.services.map((service) => service.name))
  services: string[];

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Transform(({ value, obj }) => obj.services.map((customer) => customer.name))
  customers: string[];

  @Expose()
  Rate: number;

  @Expose()
  quantity: number;

  @Expose()
  totale: number;

  @Expose()
  orderDate: Date;

  @Expose()
  orderDelivery: Date;
}