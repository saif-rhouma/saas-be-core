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
  import { CustomerService } from '../services/customer.service';
  import { CreateCustomerDto } from '../dtos/create-customer.dto';
  import { UpdateCustomerDto } from '../dtos/update-customer.dto';
  import { MSG_EXCEPTION } from 'src/common/constants/messages';
  import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { updateOrderDto } from '../dtos/update-order.dto';

@Controller('orders')
export class OrdersController {
    constructor(
        private customerService: CustomerService,
        private createCustomerDto: CreateCustomerDto, 
        private updateCustomerDto: UpdateCustomerDto, 
    ) {}

    @Get('/:id')
    async findOrder(@Param('id') id: string) {
        const order = await this.customerService.findOne(parseInt(id));
        if (!order) {
          throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ORDER);
        }
        return order;
      }

    @Post('/create')
    async createOrder(@Body() customerData:CreateCustomerDto ) {
    return this.customerService.create(customerData);
    }

    @Delete('/:id')
    async removeOrder (@Param('id') id: string) {
    return this.customerService.remove(parseInt(id));
    }

    @Patch()
    async updateUserSelfAccount(@Body() customerData: updateOrderDto) {
      const order = await this.customerService.update(customerData.id, customerData);
      return order;
    }

}
