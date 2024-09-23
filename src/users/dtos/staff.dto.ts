/* eslint-disable prettier/prettier */
import { Expose, Transform } from 'class-transformer';
export class StaffDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  lastName: string;

  @Expose()
  firstName: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  isActive: boolean;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Transform(({ value, obj }) =>
    obj.permissions.map((permission) => ({ name: permission.name, slug: permission.slug })),
  )
  permissions: any[];
}
