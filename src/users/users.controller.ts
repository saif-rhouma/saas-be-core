/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  //! Protected Route By Authentication
  @UseGuards(AuthenticationGuard)
  @Get('auth')
  async authProtected() {
    return 'Hello There!!!';
  }

  //! Protected Route By Role
  @Get('role')
  async roleProtected() {
    return 'Hello There!!!';
  }

  //! Protected Route By Permission
  @Get('permission')
  async permissionProtected() {
    return 'Hello There!!!';
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }
}
