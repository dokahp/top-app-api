import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageModel } from './top-page.model/top-page.model';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel('TopPage') private readonly topPageModel: Model<TopPageModel>,
  ) {}

  async createTopPage(dto: CreateTopPageDto) {
    const checkAliasUnique = await this.topPageModel.findOne({
      alias: dto.alias,
    });
    if (checkAliasUnique) {
      throw new HttpException(
        'error: top page with such alias exists',
        HttpStatus.CONFLICT,
      );
    }
    return await this.topPageModel.create(dto);
  }

  async getTopPageById(id: string) {
    return await this.topPageModel.findById(id).exec();
  }

  async deleteTopPageById(id: string) {
    return await this.topPageModel.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, dto: CreateTopPageDto) {
    return await this.topPageModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
  }

  async findByTopLevelCategory(dto: FindTopPageDto) {
    return await this.topPageModel
      .find({
        firstLevelCategory: dto.firstCategory,
      })
      .exec();
  }
}
