/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';

@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  create(productData: CreateProductDto) {
    const product = this.repo.create(productData);
    return this.repo.save(product);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    const product = this.repo.findOneBy({ id });
    return product;
  }

  findByName(serviceName: string) {
    return this.repo.find({ where: { serviceName } });
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ROLE);
    }
    return this.repo.remove(product);
  }

  findAll() {
    return this.repo.find();
  }

  async update(id: number, prod: UpdateProductDto) {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ROLE);
    }
    Object.assign(product, prod);
    return this.repo.save(product);
  }
}
