import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostSearchService } from 'src/post/post-search.service';
import { In, Repository } from 'typeorm';
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
  ) {}

  findAll() {
    return this.postRepository.find({ relations: ['author'] });
  }

  async findOne(id: number) {
    const post = this.postRepository.findOne(id, { relations: ['author'] });
    if (post) {
      return post;
    }
    throw new NotFoundException('Post not found');
  }

  async searchForPosts(text: string) {
    const results = await this.postSearchService.search(text);
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
    return newPost;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.postRepository.update(id, updatePostDto);
    const updatedPost = await this.findOne(id);
    if (updatedPost) {
      await this.postSearchService.update(updatedPost);
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
  }
}
