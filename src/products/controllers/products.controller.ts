/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Patch, UseGuards } from '@nestjs/common';
import { ProductService } from '../services/products.service';
import { CreateProductDto } from '../dtos/create-product.dto';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { GetUser } from 'src/common/decorators/getuser.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { ProductDto } from '../dtos/product.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductService) {}

  @Serialize(ProductDto)
  @UseGuards(AuthenticationGuard)
  @Post('/create')
  async createProduct(@Body() productData: CreateProductDto, @GetUser() user: Partial<User>) {
    const appId = parseInt(user.userOwnedApps['id']);
    return this.productsService.create(productData, appId);
  }

  @Delete('/:id')
  async removeProduct(@Param('id') id: string) {
    return this.productsService.remove(parseInt(id));
  }

  @Get('/:id')
  async findProduct(@Param('id') id: string) {
    const product = await this.productsService.findOne(parseInt(id));
    if (!product) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PRODUCT);
    }
    return product;
  }

  @Get()
  async findAllProducts() {
    return this.productsService.findAll();
  }

  @Patch(':id')
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(parseInt(id), updateProductDto);
  }
}
