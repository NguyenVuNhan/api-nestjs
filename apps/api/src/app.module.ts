import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import * as Joi from 'joi';
import { join } from 'path';
import { AuthenticationModule } from './authentication/authentication.module';
import { CategoryModule } from './category/category.module';
import { ChatModule } from './chat/chat.module';
import { CommentModule } from './comment/comment.module';
import { EmailSchedulingModule } from './email-scheduling/email-scheduling.module';
import { EmailModule } from './email/email.module';
import { ExceptionsLoggerFilter } from './exceptionsLogger.filter';
import { PostModule } from './post/post.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { ProductsModule } from './products/products.module';
import { PubSubModule } from './pub-sub/pub-sub.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { UserModule } from './user/user.module';
import { Timestamp } from './utils/scalars/timestamp.scalar';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        playground: Boolean(configService.get('GRAPHQL_PLAYGROUND')),
        autoSchemaFile: join(process.cwd(), 'apps/common/schema.gql'),
        installSubscriptionHandlers: true,
        buildSchemaOptions: {
          dateScalarMode: 'timestamp',
        },
      }),
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        // App config
        PORT: Joi.number(),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        GRAPHQL_PLAYGROUND: Joi.number(),
        TWO_FACTOR_AUTHENTICATION_APP_NAME: Joi.string(),
        // JWT
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        // Postgres
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        // Elastic
        ELASTICSEARCH_NODE: Joi.string().required(),
        ELASTICSEARCH_USERNAME: Joi.string().required(),
        ELASTICSEARCH_PASSWORD: Joi.string().required(),
        // Cloudinary
        CLOUDINARY_CLOUD_NAME: Joi.string().required(),
        CLOUDINARY_API_KEY: Joi.string().required(),
        CLOUDINARY_API_SECRET: Joi.string().required(),
        CLOUDINARY_BASE_URL: Joi.string().required(),
        // Subscriber Service
        SUBSCRIBERS_SERVICE_HOST: Joi.string().required(),
        SUBSCRIBERS_SERVICE_PORT: Joi.string().required(),
        // Message queue
        RABBITMQ_USER: Joi.string().required(),
        RABBITMQ_PASSWORD: Joi.string().required(),
        RABBITMQ_HOST: Joi.string().required(),
        RABBITMQ_QUEUE_NAME: Joi.string().required(),
        // GRPC
        GRPC_CONNECTION_URL: Joi.string().required(),
        // Redis
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        // Email
        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    PostModule,
    UserModule,
    AuthenticationModule,
    CategoryModule,
    SubscribersModule,
    CommentModule,
    ProductsModule,
    ProductCategoriesModule,
    EmailModule,
    EmailSchedulingModule,
    ChatModule,
    PubSubModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionsLoggerFilter,
    },
    Timestamp,
  ],
})
export class AppModule {}
