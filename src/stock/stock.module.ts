import { Module } from '@nestjs/common';
import { StockController } from './controllers/stock.controller';
import { StockService } from './services/stock.service';
import { UsersModule } from 'src/users/users.module';
import { ApplicationsModule } from 'src/applications/applications.module';
import { ProductsModule } from 'src/products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Stock } from './entities/stock.entity';
import { Supplying } from './entities/supplying.entity';
import { SupplyingService } from './services/supplying.service';
import { Plan } from 'src/plans/entities/plan.entity';

@Module({
  controllers: [StockController],
  providers: [StockService, SupplyingService],
  imports: [ProductsModule, TypeOrmModule.forFeature([Stock, Supplying])],
  exports: [StockService, SupplyingService],
})
export class StockModule {}
