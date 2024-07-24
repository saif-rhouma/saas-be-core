import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    UseGuards,
  } from '@nestjs/common';
  import { OrderService } from '../services/orders.service';
  import { CreateOrderDto } from '../dtos/create-order.dto';
  import { updateOrderDto } from '../dtos/update-order.dto';
  import { MSG_EXCEPTION } from 'src/common/constants/messages';
  import { Serialize } from 'src/common/interceptors/serialize.interceptor';

@Controller('orders')
export class OrdersController {
    constructor(
        private orderService: OrderService,
        private createOrderDto: CreateOrderDto, 
        private updateOrderDto: updateOrderDto, 
    ) {}

    @Get('/:id')
    async findOrder(@Param('id') id: string) {
        const order = await this.orderService.findOne(parseInt(id));
        if (!order) {
          throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ORDER);
        }
        return order;
      }

    @Post('/create')
    async createOrder(@Body() orderData:CreateOrderDto ) {
    return this.orderService.create(orderData);
    }

    @Delete('/:id')
    async removeOrder (@Param('id') id: string) {
    return this.orderService.remove(parseInt(id));
    }

    @Patch()
    async updateUserSelfAccount(@Body() orderData: updateOrderDto) {
      const order = await this.orderService.update(orderData.id, orderData);
      return order;
    }




}
