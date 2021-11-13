import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Info,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { RequestWithUser } from '../authentication/authentication.interface';
import { GraphqlJwtAuthGuard } from '../authentication/guard/graphql-jwt-auth.guard';
import { PUB_SUB } from '../pub-sub/pub-sub.module';
import { CreatePostInput } from './inputs/post.input';
import Post from './models/post.model';
import { PostService } from './post.service';

const POST_ADDED_EVENT = 'postAdded';

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

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
    const newPost = this.postService.create(createPostInput, context.req.user);
    this.pubSub.publish(POST_ADDED_EVENT, { postAdded: newPost });
    return newPost;
  }

  @Subscription(() => Post, {
    // Custom filter. If false, the event is filtered out and not returned to the clients
    // filter: (payload, variables) => {
    //   return payload.postAdded.title === 'Hello world!';
    // },
    // Resolver help to modify the response
    // resolve: (value) => {
    //   return {
    //     ...value.postAdded,
    //     title: `Title: ${value.postAdded.title}`,
    //   };
    // },
    // Inject the service to `resolver` and `filter`
    // filter: function (this: PostsResolver, payload, variables) {
    //   const postsService = this.postsService;
    //   return true;
    // },
    // resolve: function (this: PostsResolver, value) {
    //   const postsService = this.postsService;
    //   return {
    //     ...value.postAdded,
    //     title: `Title: ${value.postAdded.title}`,
    //   };
    // },
  })
  postAdded() {
    return this.pubSub.asyncIterator(POST_ADDED_EVENT);
  }
}
