import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { FilesModule } from 'src/files/files.module';
import { NationalRatesModule } from 'src/national-rates/national-rates.module';
import { ReviewModule } from 'src/review/review.module';
import { ProductController } from './product.controller';
import { ProductSchema } from './product.model/product.model';
import { ProductService } from './product.service';

@Module({
  controllers: [ProductController],
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    NationalRatesModule,
    NestjsFormDataModule,
    FilesModule,
    ReviewModule,
  ],
  providers: [ProductService],
})
export class ProductModule {}
