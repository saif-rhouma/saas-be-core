/* eslint-disable prettier/prettier */
import { Expose, Transform } from 'class-transformer';

export class UserTokenDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  @Transform(({ value }) => value.map((role) => role.name))
  roles: string[];

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}
