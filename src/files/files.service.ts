import { Injectable } from '@nestjs/common';
import { FileElementResponse } from './dto/file-element.response';
import { format } from 'date-fns';
// path - root директория всего приложения,
// которая не будет отличается ни при разработке,
// ни на продакшене, ни в любой операционной ситстеме
import { path } from 'app-root-path';
import { ensureDir, writeFile, remove } from 'fs-extra';
// ensuredir обеспечивает наличие директории, если ее нет - создаст
import * as sharp from 'sharp';
import { MFile } from './dto/mfile.class';
import { ProductImageResponse } from './dto/product-image.response';

@Injectable()
export class FilesService {
  async saveFiles(files: Promise<MFile[]>): Promise<FileElementResponse[]> {
    const res: FileElementResponse[] = [];
    const dateFolderNameForSavefiles = format(new Date(), 'yyyy-MM-dd');
    const uploadFolderPath = `${path}/uploads/${dateFolderNameForSavefiles}`;
    await ensureDir(uploadFolderPath);

    for (const file of await files) {
      await writeFile(`${uploadFolderPath}/${file.originalname}`, file.buffer);

      res.push({
        url: `${dateFolderNameForSavefiles}/${file.originalname}`,
        name: file.originalname,
      });
    }
    return res;
  }

  async productImageUpload(
    file: Express.Multer.File,
    id: string,
  ): Promise<ProductImageResponse> {
    const uploadFolderPath = `${path}/uploads/product/${id}`;
    await ensureDir(uploadFolderPath);
    await writeFile(`${uploadFolderPath}/${file.originalname}`, file.buffer);
    return {
      url: `static/product/${id}/${file.originalname}`,
    };
  }

  async deleteProductFile(filesFolder: string) {
    const pathToProductFolder = `${path}/uploads/product/${filesFolder}`;
    await remove(pathToProductFolder);
  }

  async convertToWebp(file: Buffer): Promise<Buffer> {
    return await sharp(file).webp().toBuffer();
  }

  isCyrillicSymbols(fileName: string) {
    return fileName.match(/[^\u0000-\u007f]/) ? true : false;
  }

  cyrillicEncodingToUtf8(str: string) {
    return Buffer.from(str, 'latin1').toString('utf-8');
  }

  changeFileName(fileName: string) {
    const isCyrillic = this.isCyrillicSymbols(fileName);

    if (isCyrillic) {
      const newFileName = this.cyrillicEncodingToUtf8(fileName);
      return newFileName;
    }
    return fileName;
  }
}
