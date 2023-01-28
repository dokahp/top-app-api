import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewModel } from './review.model/review.model';

@Injectable()
export class ReviewService {
  constructor(@InjectModel('Review') private reviewModel: Model<ReviewModel>) {}

  async create(dto: CreateReviewDto): Promise<ReviewModel> {
    const newReview = await this.reviewModel.create(dto);
    return newReview.save();
  }

  async delete(id: string): Promise<ReviewModel> | null {
    return await this.reviewModel.findByIdAndDelete(id).exec();
  }

  async findByProductId(productId: string) {
    return await this.reviewModel.find({ productId: productId }).exec();
  }

  async deleteByProductId(productId: string) {
    return this.reviewModel.deleteMany({ productId: productId }).exec();
  }
}
