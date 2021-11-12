import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RequestWithUser } from '../authentication/authentication.interface';
import { GraphqlJwtAuthGuard } from '../authentication/guard/graphql-jwt-auth.guard';
import { CreatePostInput } from './inputs/post.input';
import Post from './models/post.model';
import { PostService } from './post.service';

@Resolver(() => Post)
export class PostResolver {
  constructor(private postService: PostService) {}

  @Query(() => [Post])
  async posts() {
    const posts = await this.postService.findAll();
    return posts.items;
  }

  @Mutation(() => Post)
  @UseGuards(GraphqlJwtAuthGuard)
  async createPost(
    @Args('input') createPostInput: CreatePostInput,
    @Context() context: { req: RequestWithUser },
  ) {
    return this.postService.create(createPostInput, context.req.user);
  }
}
