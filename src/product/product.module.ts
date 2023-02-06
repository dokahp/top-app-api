import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NationalRatesModule } from 'src/national-rates/national-rates.module';
import { ProductController } from './product.controller';
import { ProductSchema } from './product.model/product.model';
import { ProductService } from './product.service';

@Module({
  controllers: [ProductController],
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    NationalRatesModule,
  ],
  providers: [ProductService],
})
export class ProductModule {}
