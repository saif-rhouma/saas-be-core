/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from 'src/products/services/products.service';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { CreateStockDto } from '../dtos/create-stock.dto';
import { Stock } from '../entities/stock.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock) private repo: Repository<Stock>,
    private productsService: ProductService,
  ) {}

  async createStock(stockData: CreateStockDto, productId: number) {
    const product = await this.productsService.findOne(productId);
    if (!product) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PRODUCT);
    }
    const stock = this.repo.create(stockData);
    stock.product = product;
    return this.repo.save(stock);
  }

  async createFromPlan(quantity: number, product: Product) {
    const { id } = product;
    const stock = await this.findOneByProduct(id);
    if (stock) {
      stock.quantity += quantity;
      return this.repo.save(stock);
    } else {
      const newStock = this.repo.create({ quantity });
      newStock.product = product;
      return this.repo.save(newStock);
    }
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    const stock = this.repo.findOneBy({ id });
    return stock;
  }

  async remove(id: number) {
    if (!id) {
      return null;
    }

    const stock = await this.findOne(id);
    if (!stock) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_STOCK);
    }
    return this.repo.remove(stock);
  }

  async findOneByProduct(productId: number) {
    if (!productId) {
      return null;
    }
    const stock = await this.repo.findOne({ where: { product: { id: productId } } });
    return stock;
  }

  async updateQuantity(productId: number, quantity: number) {
    const stock = await this.findOneByProduct(productId);
    if (!stock) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_STOCK);
    }
    stock.quantity = quantity;
    return this.repo.save(stock);
  }
}
