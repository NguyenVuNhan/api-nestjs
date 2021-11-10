import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RequestWithUser } from '../authentication/authentication.interface';
import JwtAuthenticationGuard from '../authentication/guard/jwtAuthentication.guard';
import PaginationParams from '../utils/dto/paginationParams.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  create(@Body() post: CreatePostDto, @Req() req: RequestWithUser) {
    return this.postService.create(post, req.user);
  }

  @Get()
  findAll(
    @Query('search') search: string,
    @Query() { limit, offset, startId }: PaginationParams,
  ) {
    if (search) {
      return this.postService.searchForPosts(search, offset, limit);
    }
    return this.postService.findAll(offset, limit, startId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.postService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
