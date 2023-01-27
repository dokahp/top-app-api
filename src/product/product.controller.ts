import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { FindProductDto } from './dto/product-find.dto';
import { ProductModel } from './product.model/product.model';

@Controller('product')
export class ProductController {
  @Post('create')
  async create(@Body() dto: Omit<ProductModel, '_id'>) {}

  @Get(':id')
  async get(@Param('id') id: string) {}

  @Patch('id')
  async update(@Param('id') id: string, @Body() dto: ProductModel) {}

  @Delete(':id')
  async delete(@Param('id') id: string) {}

  @HttpCode(HttpStatus.OK)
  @Post('find')
  async find(@Body() dto: FindProductDto) {}
}
