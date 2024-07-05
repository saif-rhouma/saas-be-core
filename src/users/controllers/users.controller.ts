/* eslint-disable prettier/prettier */
import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleType } from 'src/common/constants/roles';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PermissionType } from 'src/common/constants/permissions';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // @UseGuards(AuthenticationGuard)
  @Post('create')
  async createUser(@Body() userData: CreateUserDto) {
    const user = await this.usersService.createUser(userData);
    return user;
  }

  //! Protected Route By Authentication
  @UseGuards(AuthenticationGuard)
  @Get('auth')
  async authProtected() {
    return 'Hello There!!!';
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    console.log('-------->> USER', user);
    if (!user) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_USER);
    }
    return user;
  }

  //! New route to assign role to a user
  @Roles([RoleType.ADMIN, RoleType.STAFF])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Post('assign-role')
  async assignRole(@Body('userId') userId: number, @Body('roleName') roleName: string) {
    console.log('userId', userId, 'roleName', roleName);
    const user = await this.usersService.assignRole(userId, roleName);
    return user;
  }

  //! New route to assign permission to a user
  @Permissions([PermissionType.PRINT_ORDER])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Post('assign-permission')
  async assignPermission(@Body('userId') userId: number, @Body('permissionSlug') permissionSlug: string) {
    console.log('userId', userId, 'permissionSlug', permissionSlug);
    const user = await this.usersService.assignPermission(userId, permissionSlug);
    return user;
  }
}
