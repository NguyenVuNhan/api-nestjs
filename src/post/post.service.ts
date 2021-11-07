import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Post from 'src/post/entities/post.entity';
import { IPost } from 'src/post/post.interface';
import User from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  private lastPostId = 0;
  private posts: IPost[] = [];

  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
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

  async create(post: CreatePostDto, user: User) {
    const newPost = await this.postRepository.create({ ...post, author: user });
    await this.postRepository.save(newPost);
    return newPost;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.postRepository.update(id, updatePostDto);
    const updatedPost = await this.findOne(id);
    if (updatedPost) {
      return updatedPost;
    }
    throw new NotFoundException('Post not found');
  }

  async remove(id: number) {
    const deleteResponse = await this.postRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new NotFoundException();
    }
  }
}
