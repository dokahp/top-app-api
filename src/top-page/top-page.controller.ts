import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageService } from './top-page.service';

@Controller('top-page')
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.createTopPage(dto);
  }

  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const existTopPage = await this.topPageService.getTopPageById(id);
    if (!existTopPage) {
      throw new HttpException(
        `error: no such top-page with id=${id},`,
        HttpStatus.NOT_FOUND,
      );
    }
    return existTopPage;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedTopPage = await this.topPageService.deleteTopPageById(id);
    if (!deletedTopPage) {
      throw new HttpException(
        `error: Can't delete, no such top-page with id=${id},`,
        HttpStatus.NOT_FOUND,
      );
    }
    return deletedTopPage;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async patch(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateTopPageDto,
  ) {
    const updatedProduct = await this.topPageService.updateById(id, dto);
    if (!updatedProduct) {
      throw new HttpException('error: no such top-page', HttpStatus.NOT_FOUND);
    }
    return updatedProduct;
  }

  @HttpCode(HttpStatus.OK)
  @Post('find')
  async find(@Body() dto: FindTopPageDto) {
    return await this.topPageService.findByTopLevelCategory(dto);
  }
}
