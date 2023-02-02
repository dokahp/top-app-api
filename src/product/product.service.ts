import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReviewModel } from 'src/review/review.model/review.model';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/product-find.dto';
import { ProductModel } from './product.model/product.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<ProductModel>,
  ) {}

  async create(dto: CreateProductDto) {
    return await this.productModel.create(dto);
  }

  async findById(id: string) {
    return await this.productModel.findById(id).exec();
  }

  async deleteById(id: string) {
    return this.productModel.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, dto: Partial<CreateProductDto>) {
    // new true возвращает всегда уже новый объект обновленный, по умолчанию старый
    return this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async findProductsWithReviews(dto: FindProductDto): Promise<
    (ProductModel & {
      reviews: ReviewModel[];
      reviewCount: number;
      reviewAvg: number;
    })[]
  > {
    return await this.productModel
      .aggregate([
        {
          $match: {
            categories: dto.category,
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
        {
          $limit: dto.limit,
        },
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'productId',
            as: 'reviews',
          },
        },
        {
          $addFields: {
            reviewCount: { $size: '$reviews' },
            reviewAvg: { $avg: '$reviews.rating' },
            reviews: {
              $function: {
                body: `function (reviews) {
            		reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            		return reviews;
            	}`,
                args: ['$reviews'],
                lang: 'js',
              },
            },
          },
        },
      ])
      .exec();
  }
}
