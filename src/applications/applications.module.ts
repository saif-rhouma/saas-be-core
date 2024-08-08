/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ApplicationsService } from './services/applications.service';
import { User } from 'src/users/entities/user.entity';
import { Application } from './entities/application.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsController } from './controllers/applications.controller';
import { UsersModule } from 'src/users/users.module';
@Module({
  controllers: [ApplicationsController],
  imports: [UsersModule, TypeOrmModule.forFeature([User, Application])],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
