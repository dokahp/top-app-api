import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TopPageController } from './top-page.controller';
import { TopPageSchema } from './top-page.model/top-page.model';

@Module({
  controllers: [TopPageController],
  imports: [
    MongooseModule.forFeature([{ name: 'TopPage', schema: TopPageSchema }]),
  ],
})
export class TopPageModule {}
