/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body() signupData: CreateUserDto) {
    const user = await this.authService.signup(
      signupData.email,
      signupData.password,
    );

    return user;
  }

  @Post('/login')
  async login(@Body() credentials: LoginUserDto) {
    const user = await this.authService.login(
      credentials.email,
      credentials.password,
    );

    return user;
  }
}
