import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import PrivateFile from './entities/privateFile.entity';
import PublicFile from './entities/publicFile.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([PrivateFile, PublicFile])],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
