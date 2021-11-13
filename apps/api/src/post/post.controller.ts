import {
  Body,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
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
  UseInterceptors,
} from '@nestjs/common';
import { RequestWithUser } from '../authentication/authentication.interface';
import JwtTwoFactorGuard from '../authentication/guard/jwt-two-factor.guard';
import PaginationParams from '../utils/dto/paginationParams.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GET_POSTS_CACHE_KEY } from './post.constant';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtTwoFactorGuard)
  create(@Body() post: CreatePostDto, @Req() req: RequestWithUser) {
    return this.postService.create(post, req.user);
  }

  @Get()
  @CacheTTL(120)
  @CacheKey(GET_POSTS_CACHE_KEY)
  @UseInterceptors(CacheInterceptor)
  findAll(
    @Query('search') search: string,
    @Query() { limit, offset, startId }: PaginationParams,
  ) {
    if (search) {
      return this.postService.searchForPosts(search, offset, limit);
    }
    return this.postService.getPosts(offset, limit, startId);
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
