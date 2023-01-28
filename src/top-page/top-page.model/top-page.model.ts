import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum TopLevelCategory {
  Courses,
  Services,
  Books,
  Products,
}

class HeadHunter {
  @Prop()
  count: number;

  @Prop()
  juniorSalary: number;

  @Prop()
  middleSalary: number;

  @Prop()
  SeniorSalary: number;
}

class TopPageAdvantages {
  @Prop()
  title: string;

  @Prop()
  description: string;
}

@Schema()
export class TopPageModel {
  @Prop({ enum: TopLevelCategory, type: () => Number })
  firstLevelCategory: TopLevelCategory;

  @Prop()
  secondCategory: string;

  @Prop({ unique: true })
  alias: string;

  @Prop()
  title: string;

  @Prop()
  category: string;

  @Prop({ type: () => HeadHunter })
  hh?: HeadHunter;

  @Prop({ type: () => [TopPageAdvantages] })
  advantages: TopPageAdvantages[];

  @Prop()
  seoText: string;

  @Prop({ type: () => [String] })
  tags: string[];

  @Prop()
  tagsTitle?: string;
}

export const TopPageSchema = SchemaFactory.createForClass(TopPageModel);
