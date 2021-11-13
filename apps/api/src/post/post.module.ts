import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import { SearchModule } from '../search/search.module';
import { UserModule } from '../user/user.module';
import Post from './entities/post.entity';
import { PostSearchService } from './post-search.service';
import { PostController } from './post.controller';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';

@Module({
  imports: [
    // In memory cache example
    // CacheModule.register({
    //   // Theses are the default config values
    //   ttl: 5,
    //   max: 100,
    // }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        ttl: 120,
      }),
    }),
    TypeOrmModule.forFeature([Post]),
    SearchModule,
    UserModule,
  ],
  controllers: [PostController],
  providers: [PostService, PostSearchService, PostResolver],
})
export class PostModule {}
