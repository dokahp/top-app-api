import {
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
    @UploadedFiles()
    files: Array<Express.Multer.File>,
  ): Promise<FileElementResponse[]> {
    // VALIDATION: CHECK EACH FILE TYPE AND EACH FILE SIZE
    const allowFiles = files.find(
      (file: Express.Multer.File) =>
        !file.mimetype.includes('image') && file.size > 600000,
    );
    if (allowFiles) {
      throw new HttpException(
        'error: files type must be image and file size must be less than 600 kilobytes',
        HttpStatus.BAD_REQUEST,
      );
    }
    // END OF VALIDATION

    const saveArray: Promise<MFile[]> = Promise.all(
      files.map(async (file: Express.Multer.File) => {
        console.log(file.mimetype);
        let saveFile: MFile = new MFile(file);
        file.originalname = this.filesService.changeFileName(file.originalname);

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
