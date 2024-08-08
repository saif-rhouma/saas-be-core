/* eslint-disable prettier/prettier */
import { Expose, Transform } from 'class-transformer';

export class ProductDto {
  @Expose()
  name: string;

  @Expose()
  price: number;

  @Expose()
  isActive: boolean;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Transform(({ value, obj }) => {
    return {
      id: obj.id,
      name: obj.name,
    };
  })
  application;
}
