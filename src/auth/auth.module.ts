/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from 'src/users/users.module';
import { TokenService } from './services/token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/token.entity';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/entities/role.entity';
import { Permission } from 'src/users/entities/permission.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService, TokenService],
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User, RefreshToken, Permission, Role]),
  ],
})
export class AuthModule {}
