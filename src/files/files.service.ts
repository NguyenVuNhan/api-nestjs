import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as toStream from 'buffer-to-stream';
import { v2 } from 'cloudinary';
import PrivateFile from 'src/files/entities/privateFile.entity';
import PublicFile from 'src/files/entities/publicFile.entity';
import { QueryRunner, Repository } from 'typeorm';

@Injectable()
export class FilesService {
  private baseUrl: string;

  constructor(
    @InjectRepository(PublicFile)
    private publicFilesRepository: Repository<PublicFile>,
    @InjectRepository(PrivateFile)
    private privateFilesRepository: Repository<PrivateFile>,
    private readonly configService: ConfigService,
  ) {
    v2.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });

    this.baseUrl = this.configService.get('CLOUDINARY_URL');
  }

  async uploadPrivateFile(data: Express.Multer.File, ownerId: number) {
    const fileName = await this.uploadImage(data);
    return this.privateFilesRepository.save({
      fileName,
      owner: { id: ownerId },
    });
  }

  async getPrivateFile(fileId: number) {
    const fileInfo = await this.privateFilesRepository.findOne(
      { id: fileId },
      { relations: ['owner'] },
    );
    return fileInfo;
  }

  async uploadPublicFile(data: Express.Multer.File) {
    const fileName = await this.uploadImage(data);
    return this.publicFilesRepository.save({ fileName });
  }

  async deletePublicFile(fileId: number, queryRunner: QueryRunner) {
    const file = await queryRunner.manager.findOne(PublicFile, { id: fileId });
    await this.deleteImage(file.fileName);
    return queryRunner.manager.delete(PublicFile, fileId);
  }

  private async deleteImage(fileName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(
        fileName.slice(0, fileName.lastIndexOf('.')),
        (error) => {
          if (error) return reject(error);
          resolve();
        },
      );
    });
  }

  private async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);

        const { public_id, format } = result;
        resolve(`${public_id}.${format}`);
      });

      toStream(file.buffer).pipe(upload);
    });
  }
}
