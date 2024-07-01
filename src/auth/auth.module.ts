import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { TokenService } from './token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/token.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService, TokenService],
  imports: [UsersModule, TypeOrmModule.forFeature([User, RefreshToken])],
})
export class AuthModule {}
