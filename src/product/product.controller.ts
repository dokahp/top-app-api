import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/product-find.dto';
import { ProductModel } from './product.model/product.model';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const product = await this.productService.findById(id);
    if (!product) {
      throw new HttpException('error: no such product', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  @Patch('id')
  async update(@Param('id') id: string, @Body() dto: ProductModel) {
    const updatedProduct = await this.productService.updateById(id, dto);
    if (!updatedProduct) {
      throw new HttpException('error: no such product', HttpStatus.NOT_FOUND);
    }
    return updatedProduct;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedProduct = await this.productService.deleteById(id);
    if (!deletedProduct) {
      throw new HttpException('error: no such product', HttpStatus.NOT_FOUND);
    }
    return deletedProduct;
  }

  @HttpCode(HttpStatus.OK)
  @Post('find')
  async find(@Body() dto: FindProductDto) {
    return this.productService.findProductsWithReviews(dto);
  }
}
