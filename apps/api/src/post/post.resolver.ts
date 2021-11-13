import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Info,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';
import { RequestWithUser } from '../authentication/authentication.interface';
import { GraphqlJwtAuthGuard } from '../authentication/guard/graphql-jwt-auth.guard';
import { CreatePostInput } from './inputs/post.input';
import Post from './models/post.model';
import { PostService } from './post.service';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Query(() => [Post])
  async posts(@Info() info: GraphQLResolveInfo) {
    const parsedInfo = parseResolveInfo(info) as ResolveTree;
    const simplifiedInfo = simplifyParsedResolveInfoFragmentWithType(
      parsedInfo,
      info.returnType,
    );

    const posts =
      'author' in simplifiedInfo.fields
        ? await this.postService.getPostsWithAuthors()
        : await this.postService.getPosts();

    return posts.items;
  }

  // Instead of Joining query to show the authors, we can add a resolver
  // and usin  DataLoader to avoid N+1 problem
  // @ResolveField('author', () => User)
  // async getAuthor(@Parent() post: Post) {
  //   const { authorId } = post;

  //   return this.postLoader.batchAuthors.load(authorId);
  // }

  @Mutation(() => Post)
  @UseGuards(GraphqlJwtAuthGuard)
  async createPost(
    @Args('input') createPostInput: CreatePostInput,
    @Context() context: { req: RequestWithUser },
  ) {
    return this.postService.create(createPostInput, context.req.user);
  }
}
