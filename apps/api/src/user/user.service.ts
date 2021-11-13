import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Connection, In, Repository } from 'typeorm';
import { FilesService } from '../files/files.service';
import { CreateUserDto } from './dto/create-user.dto';
import User from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly filesService: FilesService,
    private connection: Connection,
  ) {}

  async create(user: CreateUserDto) {
    const newUser = await this.userRepository.create(user);
    await this.userRepository.save(user);
    return newUser;
  }

  async getByIds(ids: number[]) {
    return this.userRepository.find({
      where: { id: In(ids) },
    });
  }

  async getById(id: number) {
    const user = await this.userRepository.findOne({ id });
    if (user) {
      return user;
    }
    throw new NotFoundException('User with this id does not exist');
  }

  async addPrivateFile(userId: number, data: Express.Multer.File) {
    return this.filesService.uploadPrivateFile(data, userId);
  }

  async getPrivateFile(userId: number, fileId: number) {
    const file = await this.filesService.getPrivateFile(fileId);
    if (file.owner.id === userId) {
      return file;
    }
    throw new UnauthorizedException();
  }

  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(userId: number, @UploadedFile() data: Express.Multer.File) {
    const avatar = await this.filesService.uploadPublicFile(data);
    const user = await this.getById(userId);
    await this.userRepository.update(userId, {
      ...user,
      avatar,
    });
    return avatar;
  }

  async deleteAvatar(userId: number) {
    const queryRunner = this.connection.createQueryRunner();

    const user = await this.getById(userId);
    const fileId = user.avatar.id;
    if (fileId) {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        await queryRunner.manager.update(User, userId, {
          ...user,
          avatar: null,
        });
        await this.filesService.deletePublicFile(fileId, queryRunner);
        await queryRunner.commitTransaction();
      } catch (error) {
        queryRunner.rollbackTransaction();
        throw new InternalServerErrorException();
      } finally {
        await queryRunner.release();
      }
    }
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new NotFoundException('User with this email does not exist');
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async removeRefreshToken(userId: number) {
    return this.userRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }
}
