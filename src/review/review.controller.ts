import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserEmail } from 'src/decorators/user-email/user-email.decorator';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { TelegramService } from 'src/telegram/telegram.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly telegramService: TelegramService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  @Post('notify')
  async notify(@Body() dto: CreateReviewDto) {
    const message =
      `New Review on ${dto.productId}\n` +
      `Name:${dto.name}\n` +
      `Title: ${dto.title}\n` +
      `Description: ${dto.description}\n` +
      `Rating: ${dto.rating}`;
    return this.telegramService.sendMessage(message);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedReview = await this.reviewService.delete(id);
    if (!deletedReview) {
      throw new HttpException(
        `error: No review with id=${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('byProduct/:productId')
  async getByProduct(
    @Param('productId', IdValidationPipe) productId: string,
    @UserEmail() email: string,
  ) {
    return this.reviewService.findByProductId(productId);
  }
}
