/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from '../dtos/login-user.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserDto } from 'src/users/dtos/user.dto';
import { RefreshTokenDto } from '../dtos/refresh-tokens.dto';
import { HTTP_CODE } from 'src/common/constants/http-status-code';
import { CreateSimpleUserDto } from '../dtos/create-simple-user.dto';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { UsersService } from 'src/users/services/users.service';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { UserMeDto } from '../dtos/user-me.dto';
import getApplicationId from 'src/common/helpers/application-id.func';
import { ApplicationsService } from 'src/applications/services/applications.service';
import { MSG_EXCEPTION } from 'src/common/constants/messages';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private applicationsService: ApplicationsService,
  ) {}
  @Serialize(UserDto)
  @Post('/signup')
  async createSimpleUser(@Body() signupData: CreateSimpleUserDto) {
    const user = await this.authService.signup(signupData);
    return user;
  }
  @Serialize(UserDto)
  @HttpCode(HTTP_CODE.OK)
  @Post('/login')
  async login(@Body() credentials: LoginUserDto) {
    const tokens = await this.authService.login(credentials.email, credentials.password);
    return tokens;
  }
  @Serialize(UserDto)
  @HttpCode(HTTP_CODE.OK)
  @UseGuards(AuthenticationGuard)
  @Get('/me')
  async authMe(@GetUser() user: Partial<User>) {
    const [userData] = await this.usersService.find(user.email);
    return userData;
  }

  @UseGuards(AuthenticationGuard)
  @Get('/application')
  async authApplication(@GetUser() user: Partial<User>) {
    const appId = getApplicationId(user);
    const application = await this.applicationsService.findOne(appId);
    if (!application) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
    }
    return application;
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
