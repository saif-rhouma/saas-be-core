/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';

export const ROLES_DECO_KEY = 'roles';
export const Roles = (roles: string[]) => SetMetadata(ROLES_DECO_KEY, roles);
