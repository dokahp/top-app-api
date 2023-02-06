import { Module } from '@nestjs/common';
import { NationalRatesService } from './national-rates.service';
import { NationalRatesController } from './national-rates.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NationalRatesSchema } from './model/national-rates.model';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'NationalRates', schema: NationalRatesSchema },
    ]),
    HttpModule,
  ],
  providers: [NationalRatesService],
  controllers: [NationalRatesController],
  exports: [NationalRatesService],
})
export class NationalRatesModule {}
