/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PlansController } from './controllers/plans.controller';
import { PlansService } from './services/plans.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';
import { User } from 'src/users/entities/user.entity';
import { Application } from 'src/applications/entities/application.entity';
import { ApplicationsModule } from 'src/applications/applications.module';

@Module({
  controllers: [PlansController],
  providers: [PlansService],
  imports: [UsersModule, ApplicationsModule, ProductsModule, TypeOrmModule.forFeature([Plan, User, Application])],
})
export class PlansModule {}
