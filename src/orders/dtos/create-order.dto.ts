/* eslint-disable prettier/prettier */
import { Expose, Transform } from 'class-transformer';

export class CreateOrderDto {
  @Expose()
  id: number;

  @Expose()  
  email: string;

  // @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // @Transform(({ value, obj }) => obj.roles.map((Customer) => Customer.name))
  // customers: string[];

  @Expose()
  phoneNumber: string;

  @Expose()
  accountType: string;
}
