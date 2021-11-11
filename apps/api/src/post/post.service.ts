import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GET_POSTS_CACHE_KEY } from 'apps/api/src/post/post.constant';
import { Cache } from 'cache-manager';
import { FindManyOptions, In, MoreThan, Repository } from 'typeorm';
import { PostSearchService } from '../post/post-search.service';
import User from '../user/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import Post from './entities/post.entity';
import { IPost } from './type/post.interface';

@Injectable()
export class PostService {
  private lastPostId = 0;
  private posts: IPost[] = [];

  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private postSearchService: PostSearchService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async clearCache() {
    const keys: string[] = await this.cacheManager.store.keys();
    keys.forEach((key) => {
      if (key.startsWith(GET_POSTS_CACHE_KEY)) {
        this.cacheManager.del(key);
      }
    });
  }

  async findAll(offset?: number, limit?: number, startId?: number) {
    const where: FindManyOptions<Post>['where'] = {};
    let separateCount = 0;
    if (startId) {
      where.id = MoreThan(startId);
      separateCount = await this.postRepository.count();
    }

    const [items, count] = await this.postRepository.findAndCount({
      where,
      relations: ['author'],
      order: {
        id: 'ASC',
      },
      skip: offset,
      take: limit,
    });

    return {
      items,
      count: startId ? separateCount : count,
    };
  }

  async findOne(id: number) {
    const post = this.postRepository.findOne(id, { relations: ['author'] });
    if (post) {
      return post;
    }
    throw new NotFoundException('Post not found');
  }

  async getPostsWithParagraph(paragraph: string) {
    // Pass argument to prevent SQL injection
    return this.postRepository.query(
      `SELECT * from post WHERE $1 = ANY(paragraphs)`,
      [paragraph],
    );
  }

  async searchForPosts(text: string, offset?: number, limit?: number) {
    const { results } = await this.postSearchService.search(
      text,
      offset,
      limit,
    );
    const ids = results.map((result) => result.id);
    if (!ids.length) {
      return [];
    }
    return this.postRepository.find({ where: { id: In(ids) } });
  }

  async create(post: CreatePostDto, user: User) {
    const newPost = await this.postRepository.create({ ...post, author: user });
    await this.postRepository.save(newPost);
    this.postSearchService.indexPost(newPost);
    await this.clearCache();
    return newPost;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.postRepository.update(id, updatePostDto);
    const updatedPost = await this.findOne(id);
    if (updatedPost) {
      await this.postSearchService.update(updatedPost);
      await this.clearCache();
      return updatedPost;
    }
    throw new NotFoundException('Post not found');
  }

  async remove(id: number) {
    const deleteResponse = await this.postRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new NotFoundException();
    }
    await this.postSearchService.remove(id);
    await this.clearCache();
  }
}
