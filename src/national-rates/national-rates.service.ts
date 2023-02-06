import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { NationalRates } from './model/national-rates.model';

@Injectable()
export class NationalRatesService {
  constructor(
    @InjectModel('NationalRates')
    private readonly nationalRatesModel: Model<NationalRates>,
    private readonly httpService: HttpService,
  ) {}

  async getTodayRates() {
    const { data } = await lastValueFrom(
      this.httpService.get<NationalRates>(
        'https://developerhub.alfabank.by:8273/partner/1.0.1/public/rates',
      ),
    );
    return this.nationalRatesModel.create(data);
  }

  async getById(id: string) {
    return this.nationalRatesModel.findById(id);
  }

  async getLastRatesFromDB() {
    return await this.nationalRatesModel
      .find()
      .sort({ _id: -1 })
      .limit(1)
      .findOne({ 'rates.buyIso': 'RUB', 'rates.sellIso': 'USD' })
      .exec();
  }
}
