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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/product-find.dto';
import { ProductModel } from './product.model/product.model';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // сначала создать продукт из json, потом обновить продукт по существующему айди,
  // добавив загрузку изображений по второму ендоинту
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @UseInterceptors(FileInterceptor('image'))
  @Post('uploadImage/:id')
  async uploadImage(
    @Param('id', IdValidationPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file.mimetype.includes('image') || file.size > 600000) {
      throw new HttpException(
        'error: file must be image and file size must be less then 600kb',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.productService.uploadProductImage(file, id);
  }

  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const product = await this.productService.findById(id);
    if (!product) {
      throw new HttpException('error: no such product', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('id')
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: ProductModel,
  ) {
    const updatedProduct = await this.productService.updateById(id, dto);
    if (!updatedProduct) {
      throw new HttpException('error: no such product', HttpStatus.NOT_FOUND);
    }
    return updatedProduct;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
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
