import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule } from '@app/database';
import { SubscribersModule } from './subscribers/subscribers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        // App config
        PORT: Joi.number(),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        // Postgres
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        // Message queue
        RABBITMQ_USER: Joi.string().required(),
        RABBITMQ_PASSWORD: Joi.string().required(),
        RABBITMQ_HOST: Joi.string().required(),
        RABBITMQ_QUEUE_NAME: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    SubscribersModule,
  ],
})
export class AppModule {}
