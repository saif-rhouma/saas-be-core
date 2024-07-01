/* eslint-disable prettier/prettier */
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserDto } from 'src/users/dtos/user.dto';
import { RefreshTokenDto } from './dtos/refresh-tokens.dto';
import { HTTP_CODE } from 'src/common/constants/http-status-code';

@Serialize(UserDto)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async createUser(@Body() signupData: CreateUserDto) {
    const user = await this.authService.signup(
      signupData.email,
      signupData.password,
    );
    return user;
  }

  @HttpCode(HTTP_CODE.OK)
  @Post('/login')
  async login(@Body() credentials: LoginUserDto) {
    const tokens = await this.authService.login(
      credentials.email,
      credentials.password,
    );
    return tokens;
  }

  @HttpCode(HTTP_CODE.NO_CONTENT)
  @Post('/logout')
  async logout(@Body() refreshToken: RefreshTokenDto) {
    return this.authService.logout(refreshToken.token);
  }

  @HttpCode(HTTP_CODE.ACCEPTED)
  @Post('refresh')
  async refreshTokens(@Body() refreshToken: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshToken.token);
  }
}
