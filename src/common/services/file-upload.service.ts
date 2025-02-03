import { Injectable, BadRequestException } from '@nestjs/common';
import { Express } from 'express';

@Injectable()
export class FileUploadService {
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

  fileFilter(
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: any, acceptFile: boolean) => void,
  ) {
    if (this.allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new BadRequestException(
          'Invalid file type. Only JPEG, PNG, and GIF are allowed.',
        ),
        false,
      );
    }
  }
}
