import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchModule } from '../search/search.module';
import Post from './entities/post.entity';
import { PostSearchService } from './post-search.service';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), SearchModule],
  controllers: [PostController],
  providers: [PostService, PostSearchService],
})
export class PostModule {}
