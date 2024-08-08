/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products.controller';
import { ProductService } from './services/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ApplicationsModule } from 'src/applications/applications.module';
import { Application } from 'src/applications/entities/application.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductService],
  imports: [ApplicationsModule, TypeOrmModule.forFeature([Product, Application])],
  exports: [ProductService],
})
export class ProductsModule {}
