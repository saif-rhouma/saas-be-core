/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CustomersService } from '../services/customers.service';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { CustomerDto } from '../dtos/customer.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';

@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Serialize(CustomerDto)
  @UseGuards(AuthenticationGuard)
  @Post('/create')
  async createRole(@Body() applicationData: CreateCustomerDto, @GetUser() user: Partial<User>) {
    const appId = parseInt(user.userOwnedApps['id']);
    return this.customersService.createCustomer(applicationData, user.id, appId);
  }

  @UseGuards(AuthenticationGuard)
  @Get()
  async findAll(@GetUser() user: Partial<User>) {
    const appId = parseInt(user.userOwnedApps['id']);
    const customers = await this.customersService.findAllByApplication(appId);
    if (!customers) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_CUSTOMER);
    }
    return customers;
  }

  @Get('/:id')
  async findCustomer(@Param('id') id: string) {
    const customer = await this.customersService.findOne(parseInt(id));
    if (!customer) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_CUSTOMER);
    }
    return customer;
  }

  @UseGuards(AuthenticationGuard)
  @Patch('/:id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() customerData: UpdateCustomerDto,
    @GetUser() user: Partial<User>,
  ) {
    const appId = parseInt(user.userOwnedApps['id']);
    const customer = await this.customersService.update(parseInt(id), appId, customerData);
    return customer;
  }

  @UseGuards(AuthenticationGuard)
  @Delete('/:id')
  removeCustomer(@Param('id') id: string, @GetUser() user: Partial<User>) {
    const appId = parseInt(user.userOwnedApps['id']);
    return this.customersService.remove(parseInt(id), appId);
  }
}
