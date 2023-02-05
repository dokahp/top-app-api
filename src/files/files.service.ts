import { Injectable } from '@nestjs/common';
import { FileElementResponse } from './dto/file-element.response';
import { format } from 'date-fns';
// path - root директория всего приложения,
// которая не будет отличается ни при разработке,
// ни на продакшене, ни в любой операционной ситстеме
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
// ensuredir обеспечивает наличие директории, если ее нет - создаст
import * as sharp from 'sharp';
import { MFile } from './dto/mfile.class';

@Injectable()
export class FilesService {
  async saveFiles(files: MFile[]): Promise<FileElementResponse[]> {
    const res: FileElementResponse[] = [];
    const dateFolderNameForSavefiles = format(new Date(), 'yyyy-MM-dd');
    const uploadFolderPath = `${path}/uploads/${dateFolderNameForSavefiles}`;
    await ensureDir(uploadFolderPath);

    for (const file of files) {
      await writeFile(`${uploadFolderPath}/${file.originalname}`, file.buffer);

      res.push({
        url: `${dateFolderNameForSavefiles}/${file.originalname}`,
        name: file.originalname,
      });
    }
    return res;
  }

  async convertToWebp(file: Buffer): Promise<Buffer> {
    return await sharp(file).webp().toBuffer();
  }
}
