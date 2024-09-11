/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products.controller';
import { ProductService } from './services/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ApplicationsModule } from 'src/applications/applications.module';
import { Application } from 'src/applications/entities/application.entity';
import { ProductAddonsService } from './services/product-addons.service';
import { ProductAddonsController } from './controllers/product-addons.controller';
import { ProductAddon } from './entities/product-addon.entity';

@Module({
  controllers: [ProductsController, ProductAddonsController],
  providers: [ProductService, ProductAddonsService],
  imports: [ApplicationsModule, TypeOrmModule.forFeature([Product, ProductAddon, Application])],
  exports: [ProductService, ProductAddonsService],
})
export class ProductsModule {}
