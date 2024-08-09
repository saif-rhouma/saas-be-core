/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Customer } from '../entities/customer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/services/users.service';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { ApplicationsService } from 'src/applications/services/applications.service';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer) private repo: Repository<Customer>,
    private usersService: UsersService,
    private applicationsService: ApplicationsService,
  ) {}

  async createCustomer(customerData: Partial<Customer>, userId: number, applicationId: number) {
    const customers = await this.repo.find({ where: { email: customerData.email } });
    if (customers.length) {
      // throw Exception !!!
      throw new BadRequestException(MSG_EXCEPTION.OTHER_ALREADY_IN_USE_EMAIL_CUSTOMER);
    }

    const customer = this.repo.create({ ...customerData });
    if (!userId) {
      return null;
    }
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException(MSG_EXCEPTION.NOT_FOUND_USER);
    }
    const application = await this.applicationsService.findOne(applicationId);
    if (!application) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
    }
    customer.createdBy = user;
    customer.application = application;
    return this.repo.save(customer);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    const customer = this.repo.findOneBy({ id });
    return customer;
  }

  findAllByApplication(appId: number) {
    return this.repo.find({ where: { application: { id: appId } } });
  }

  findByName(name: string, appId: number) {
    return this.repo.find({ where: { name, application: { id: appId } } });
  }

  async remove(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    // const customer = await this.findOne(id);
    const customer = await this.repo.findOne({ where: { id, application: { id: appId } } });
    if (!customer) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_CUSTOMER);
    }
    return this.repo.remove(customer);
  }

  async update(id: number, appId: number, customerData: UpdateCustomerDto) {
    const customer = await this.repo.findOne({ where: { id, application: { id: appId } } });
    if (!customer) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_CUSTOMER);
    }
    Object.assign(customer, customerData);
    return this.repo.save(customer);
  }
}
