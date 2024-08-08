/* eslint-disable prettier/prettier */
import { Expose, Transform } from 'class-transformer';
export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Transform(({ value, obj }) => obj.roles.map((role) => role.name))
  roles: string[];

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Transform(({ value, obj }) =>
    Object.assign(
      {},
      ...obj.userOwnedApps.map((app) => {
        return {
          id: app.id,
          name: app.name,
        };
      }),
    ),
  )
  userOwnedApps;

  @Expose()
  phoneNumber: string;

  @Expose()
  accountType: string;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}
