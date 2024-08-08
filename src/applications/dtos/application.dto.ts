/* eslint-disable prettier/prettier */
import { Expose, Transform } from 'class-transformer';
export class ApplicationDto {
  @Expose()
  name: string;

  @Expose()
  printerPOS: string;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Transform(({ value, obj }) => obj.owner.id)
  owner: string[];

  @Expose()
  currencySymbol: string;

  @Expose()
  taxPercentage: number;
}
