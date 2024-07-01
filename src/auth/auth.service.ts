/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokenService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email);
    if (users.length) {
      // throw Exception !!!
      throw new BadRequestException('Email already in use!');
    }
    // Hash the users password
    // Generate a salt
    const salt = randomBytes(8).toString('hex');
    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // Join the hashed result and the salt together
    const result = `${salt}.${hash.toString('hex')}`;
    // Create a new user and save it
    const user = await this.usersService.create(email, result);
    return user;
  }

  async login(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      // throw Exception !!!
      // throw new NotFoundException('user not found');
      throw new UnauthorizedException('Wrong credentials');
    }
    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (hash.toString('hex') !== storedHash) {
      // throw new BadRequestException('bad password');
      throw new UnauthorizedException('Wrong credentials');
    }
    const { accessToken, refreshToken } = await this.generateUserTokens(user);
    await this.storeRefreshToken(refreshToken, user);
    return { ...user, accessToken, refreshToken };
  }

  async logout(refreshToken: string) {
    return this.tokenService.remove(refreshToken);
  }

  async generateUserTokens(user) {
    const accessToken = this.jwtService.sign({ user }, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(
      { user },
      { secret: this.config.get<string>('REFRESH_TOKEN_SECRET') },
    );
    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    if (refreshToken == null) {
      throw new UnauthorizedException();
    }
    const token = await this.tokenService.findOne(refreshToken);

    if (!token) {
      throw new UnauthorizedException();
    }
    const { user } = await this.jwtService.verify(refreshToken, {
      secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
    });

    const { accessToken } = await this.generateUserTokens(user);
    return { accessToken };
  }

  async storeRefreshToken(refreshToken, user) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);
    this.tokenService.create(refreshToken, user, expiryDate);
  }
}
