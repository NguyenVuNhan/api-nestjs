import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { RequestWithUser } from '../authentication/authentication.interface';
import JwtAuthenticationGuard from '../authentication/guard/jwtAuthentication.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('avatar')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(
    @Req() request: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.addAvatar(request.user.id, file);
  }

  @Delete('avatar')
  @UseGuards(JwtAuthenticationGuard)
  async deleteAvatar(@Req() request: RequestWithUser) {
    await this.userService.deleteAvatar(request.user.id);
    return {};
  }

  @Post('files')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FilesInterceptor('file'))
  async addPrivateFile(
    @Req() request: RequestWithUser,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log(files);

    for (const file of files) {
      return this.userService.addPrivateFile(request.user.id, file);
    }
  }

  @Get('files/:id')
  @UseGuards(JwtAuthenticationGuard)
  async getPrivateFile(
    @Req() request: RequestWithUser,
    @Param('id', ParseIntPipe) id,
  ) {
    const file = await this.userService.getPrivateFile(
      request.user.id,
      Number(id),
    );
    return file;
  }
}
