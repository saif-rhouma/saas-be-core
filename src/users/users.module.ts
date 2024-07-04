/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RefreshToken } from '../auth/entities/token.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { RolesController } from './controllers/roles.controller';
import { RolesService } from './services/roles.service';
import { PermissionsService } from './services/permissions.service';
import { PermissionsController } from './controllers/permissions.controller';

@Module({
  controllers: [UsersController, RolesController, PermissionsController],
  providers: [UsersService, RolesService, PermissionsService],
  imports: [TypeOrmModule.forFeature([User, RefreshToken, Role, Permission])],
  exports: [UsersService, RolesService],
})
export class UsersModule {}
