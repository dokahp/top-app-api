import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewController } from './review.controller';
import { ReviewSchema } from './review.model/review.model';
import { ReviewService } from './review.service';

@Module({
  controllers: [ReviewController],
  imports: [
    MongooseModule.forFeature([{ name: 'Review', schema: ReviewSchema }]),
  ],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
