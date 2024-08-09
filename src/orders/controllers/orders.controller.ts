/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { OrderDto } from '../dtos/order.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { UpdateOrderDto } from '../dtos/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Serialize(OrderDto)
  @UseGuards(AuthenticationGuard)
  @Post('/create')
  async createRole(@Body() orderData: CreateOrderDto, @GetUser() user: Partial<User>) {
    const appId = parseInt(user.userOwnedApps['id']);
    return this.ordersService.createOrder(orderData, user.id, appId);
  }

  @UseGuards(AuthenticationGuard)
  @Get()
  async findAll(@GetUser() user: Partial<User>) {
    const appId = parseInt(user.userOwnedApps['id']);
    const plans = await this.ordersService.findAllByApplication(appId);
    if (!plans) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ORDER);
    }
    return plans;
  }

  @UseGuards(AuthenticationGuard)
  @Get('/:id')
  async findOrder(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = parseInt(user.userOwnedApps['id']);
    const order = await this.ordersService.findOneByApplication(parseInt(id), appId);
    return order;
  }

  @UseGuards(AuthenticationGuard)
  @Patch('/:id')
  async updatePlan(@Param('id') id: string, @Body() orderData: UpdateOrderDto, @GetUser() user: Partial<User>) {
    const appId = parseInt(user.userOwnedApps['id']);
    const order = await this.ordersService.update(parseInt(id), appId, orderData);
    return order;
  }

  @UseGuards(AuthenticationGuard)
  @Delete('/:id')
  removePlan(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = parseInt(user.userOwnedApps['id']);
    return this.ordersService.remove(parseInt(id), appId);
  }
}
