/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Order) private repo: Repository<Customer>
  ) {

    }

  create(CustomerData: CreateCustomerDto) {
    const customer = this.repo.create(CustomerData);
    return this.repo.save(customer);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOneBy({ id });
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ORDER);
    }
    return this.repo.remove(order);
  }

  async update(id: number, attrs: Partial<Customer>) {
    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ORDER);
    }
    Object.assign(order, attrs);
    return this.repo.save(order);
  }


}
