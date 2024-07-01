/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

    return this.generateUserTokens(user.id);
  }

  async generateUserTokens(userId) {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '1h' });
    return { accessToken };
  }
}
