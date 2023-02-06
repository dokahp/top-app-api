import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FileElementResponse } from './dto/file-element.response';
import { MFile } from './dto/mfile.class';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @HttpCode(HttpStatus.OK)
  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<FileElementResponse[]> {
    const saveArray: Promise<MFile[]> = Promise.all(
      files.map(async (file: Express.Multer.File) => {
        let saveFile: MFile = new MFile(file);
        if (file.mimetype.includes('image')) {
          const convertToWebp = await this.filesService.convertToWebp(
            file.buffer,
          );
          saveFile = new MFile({
            originalname: `${file.originalname.split('.')[0]}.webp`,
            buffer: convertToWebp,
          });
        }
        return saveFile;
      }),
    );

    return await this.filesService.saveFiles(saveArray);
  }
}
