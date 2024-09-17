/* eslint-disable prettier/prettier */
import { Expose, Transform } from 'class-transformer';
import { PlanStatus } from '../entities/plan.entity';
import { Product } from 'src/products/entities/product.entity';

export class PlanDto {
  @Expose()
  id: number;

  @Expose()
  planDate: Date;

  @Expose()
  status: PlanStatus;

  @Expose()
  quantity: number;

  @Expose()
  isHidden: boolean;

  @Expose()
  isTransferred: boolean;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Transform(({ value, obj }) => {
    return { id: obj.createdBy.id, firstName: obj.createdBy.firstName, lastName: obj.createdBy.lastName };
  })
  createdBy: any;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Transform(({ value, obj }) => obj.product)
  product: Product;
}
