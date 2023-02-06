import { Controller, Get, Param } from '@nestjs/common';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { NationalRatesService } from './national-rates.service';

@Controller('national-rates')
export class NationalRatesController {
  constructor(private readonly nationalRatesService: NationalRatesService) {}

  @Get()
  async getTodayRates() {
    return await this.nationalRatesService.getTodayRates();
  }

  @Get(':id')
  async getById(@Param('id', IdValidationPipe) id: string) {
    return await this.nationalRatesService.getById(id);
  }
}
