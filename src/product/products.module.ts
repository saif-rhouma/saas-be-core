/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';


@Module({
  controllers: [ProductController],
  providers: [ProductService, ],
  imports: [TypeOrmModule.forFeature([Product])],
  exports: [ProductService],
})
export class ProductsModule {}
