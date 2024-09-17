/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ApplicationsService } from 'src/applications/services/applications.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private repo: Repository<Product>,
    private applicationsService: ApplicationsService,
  ) {}

  async create(productData: CreateProductDto, applicationId: number) {
    const application = await this.applicationsService.findOne(applicationId);
    if (!application) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
    }
    const product = this.repo.create(productData);
    product.application = application;
    return this.repo.save(product);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    const product = this.repo.findOneBy({ id });
    return product;
  }

  async findByIds(appId: number, ids: number[]) {
    const products = await this.repo
      .createQueryBuilder('product')
      .where('(application.id = :id) AND (product.id IN (:...ids))', {
        id: appId,
        ids: ids,
      })
      .leftJoinAndSelect('product.application', 'application')
      .getMany();
    return products;
  }

  findByName(name: string, appId: number) {
    return this.repo.find({ where: { name, application: { id: appId } } });
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PRODUCT);
    }
    return this.repo.remove(product);
  }

  findAll(appId: number) {
    return this.repo.find({ where: { application: { id: appId } } });
  }

  findAllStock(appId: number) {
    return this.repo.find({ where: { application: { id: appId } }, relations: { stock: true } });
  }

  async update(id: number, prod: UpdateProductDto) {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PRODUCT);
    }
    Object.assign(product, prod);
    return this.repo.save(product);
  }

  async topFiveProducts(appId: number) {
    if (!appId) {
      return null;
    }

    const LIMIT_ROW = 5;

    const analytics = await this.repo.manager.query(`
      SELECT p.*, SUM(op.quantity) AS total_quantity
      FROM product p
      LEFT JOIN product_to_order op ON p.id = op.productId 
      LEFT JOIN "order" o ON op.orderId = o.id
      LEFT JOIN application s ON o.applicationId = s.id
      WHERE s.id = ${appId}
      GROUP BY p.id, p.name 
      ORDER BY total_quantity DESC
      LIMIT ${LIMIT_ROW};`);

    return analytics;
  }
}
