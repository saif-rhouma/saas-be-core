/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Patch } from '@nestjs/common';
import { ProductService } from '../services/products.service';
import { CreateProductDto } from '../dtos/create-product.dto';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { UpdateProductDto } from '../dtos/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('/create')
  async createProduct(@Body() productData: CreateProductDto) {
    return this.productService.create(productData);
  }

  @Delete('/:id')
  async removeProduct(@Param('id') id: string) {
    return this.productService.remove(parseInt(id));
  }

  @Get('/:id')
  async findProduct(@Param('id') id: string) {
    const product = await this.productService.findOne(parseInt(id));
    if (!product) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PRODUCT);
    }
    return product;
  }

  @Get()
  async findAllProducts() {
    return this.productService.findAll();
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(parseInt(id), updateProductDto);
  }
}
