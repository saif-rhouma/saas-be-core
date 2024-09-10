/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Plan } from '../entities/plan.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/services/users.service';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { ProductService } from 'src/products/services/products.service';
import { ApplicationsService } from 'src/applications/services/applications.service';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan) private repo: Repository<Plan>,
    private usersService: UsersService,
    private productsService: ProductService,
    private applicationsService: ApplicationsService,
  ) {}

  async createPlan(planData: Partial<Plan>, userId: number, productId: number, applicationId: number) {
    const plan = this.repo.create({ ...planData });
    if (!userId) {
      return null;
    }
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_USER);
    }

    const product = await this.productsService.findOne(productId);
    if (!product) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PRODUCT);
    }

    const application = await this.applicationsService.findOne(applicationId);
    if (!application) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
    }

    plan.createdBy = user;
    plan.product = product;
    plan.application = application;

    return this.repo.save(plan);
  }

  findByCreatedUser(userId: number) {
    if (!userId) {
      return null;
    }
    const plan = this.repo.find({ where: { createdBy: { id: userId } } });
    if (!plan) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PLAN);
    }
    return plan;
  }

  findAllByApplication(appId: number) {
    if (!appId) {
      return null;
    }
    const plan = this.repo.find({
      where: { application: { id: appId } },
      relations: { product: true, createdBy: true },
    });
    if (!plan) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PLAN);
    }
    return plan;
  }

  async findOneByApplication(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const plan = await this.repo.findOne({ where: { id, application: { id: appId } }, relations: { product: true } });
    if (!plan) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PLAN);
    }
    return plan;
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    const plan = this.repo.findOneBy({ id });
    return plan;
  }

  async update(id: number, appId: number, attrs: Partial<Plan>, productId: number) {
    let product;
    const plan = await this.findOneByApplication(id, appId);
    if (productId) {
      product = await this.productsService.findOne(productId);
      if (!product) {
        throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PRODUCT);
      }
      plan.product = product;
    }

    Object.assign(plan, attrs);
    return this.repo.save(plan);
  }

  async remove(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const plan = await this.findOneByApplication(id, appId);
    if (!plan) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PLAN);
    }
    return this.repo.remove(plan);
  }
}
