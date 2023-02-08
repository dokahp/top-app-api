import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilesService } from 'src/files/files.service';
import { Rate } from 'src/national-rates/model/national-rates.model';
import { NationalRatesService } from 'src/national-rates/national-rates.service';
import { ReviewModel } from 'src/review/review.model/review.model';
import { ReviewService } from 'src/review/review.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/product-find.dto';
import { ProductModel } from './product.model/product.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<ProductModel>,
    private readonly nationalRatesService: NationalRatesService,
    private readonly fileService: FilesService,
    private readonly reviewService: ReviewService,
  ) {}

  async create(dto: CreateProductDto) {
    return await this.productModel.create(dto);
  }

  async uploadProductImage(file: Express.Multer.File, id: string) {
    const uploadedFileUrl = await this.fileService.productImageUpload(file, id);
    const { url } = uploadedFileUrl;
    return this.updateImageProductUrl(id, url);
  }

  async findById(id: string) {
    return await this.productModel.findById(id).exec();
  }

  async deleteById(id: string) {
    const product = await this.findById(id);
    if (!product) {
      throw new HttpException('error: no such product', HttpStatus.NOT_FOUND);
    }

    this.fileService.deleteProductFile(id);
    await this.reviewService.deleteByProductId(id);

    return this.productModel.findByIdAndDelete(id).exec();
  }

  async updateImageProductUrl(id: string, imageSrc: string) {
    await this.productModel
      .updateOne({ _id: id }, { $set: { image: imageSrc } })
      .exec();
    return this.findById(id);
  }

  async updateById(id: string, dto: CreateProductDto) {
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
    const lastRatesRecord =
      await this.nationalRatesService.getLastRatesFromDB();
    let { rates } = lastRatesRecord;
    const rubToUsdRate: Rate = rates.find(
      (rate: Rate) => rate.buyIso === 'RUB' && rate.sellIso === 'USD',
    );
    const rubToEurRate = rates.find(
      (rate: Rate) => rate.buyIso === 'RUB' && rate.sellIso === 'EUR',
    );
    return await this.productModel
      .aggregate([
        {
          $match: {
            categories: dto.category,
          },
        },
        {
          $addFields: {
            priceUSD: {
              $divide: ['$price', rubToUsdRate.buyRate],
            },
            priceEUR: {
              $divide: ['$price', rubToEurRate.buyRate],
            },
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
