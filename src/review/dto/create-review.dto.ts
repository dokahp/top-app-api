import { IsNumber, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @Max(5)
  @Min(0)
  @IsNumber()
  rating: number;

  @IsUUID()
  productId: string;
}
