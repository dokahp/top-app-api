import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum TopLevelCategory {
  Courses,
  Services,
  Books,
  Products,
}

class HeadHunter {
  @IsNumber()
  count: number;

  @IsNumber()
  juniorSalary: number;

  @IsNumber()
  middleSalary: number;

  @IsNumber()
  SeniorSalary: number;
}

class TopPageAdvantages {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class CreateTopPageDto {
  @IsEnum(TopLevelCategory)
  firstLevelCategory: TopLevelCategory;

  @IsString()
  secondCategory: string;

  @IsString()
  alias: string;

  @IsString()
  title: string;

  @IsString()
  category: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => HeadHunter)
  hh?: HeadHunter;

  @IsArray()
  @ValidateNested()
  @Type(() => TopPageAdvantages)
  advantages: TopPageAdvantages[];

  @IsString()
  seoText: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsOptional()
  @IsString()
  tagsTitle?: string;
}
