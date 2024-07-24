import { Module } from '@nestjs/common';
import { OrdersController } from './controllers/orders.controller';
import { OrderService } from './services/orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { updateOrderDto } from './dtos/update-order.dto';
import { Customer } from './entities/customer.entity';

@Module({
  controllers: [OrdersController],
  providers: [OrderService,CreateOrderDto,updateOrderDto],
  imports: [TypeOrmModule.forFeature([Order])],
  exports: [CreateOrderDto,updateOrderDto],
})
export class OrdersModule {}
