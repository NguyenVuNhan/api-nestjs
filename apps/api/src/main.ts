import {
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { runInCluster } from './runInCluster';
import { RedisIoAdapter } from './utils/adapter/redis-io.adapter';
import { ExcludeNullInterceptor } from './utils/interceptor/exclideNull.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'warn', 'error', 'log', 'verbose'],
  });
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');
  app.useWebSocketAdapter(new RedisIoAdapter(app));

  // ======================================================================
  // User input validation
  // ======================================================================
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const error = {};
        for (const e of errors) {
          error[e.property] = e.constraints;
        }
        return new HttpException(
          {
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            error,
            message: 'Invalid Input',
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      },
    }),
  );

  // ======================================================================
  // Interceptor
  // ======================================================================
  // app.useGlobalInterceptors(new ExcludeNullInterceptor());
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // ======================================================================
  // Swagger
  // ======================================================================
  const config = new DocumentBuilder()
    .setTitle('Nest-api')
    .setDescription('Nest API Description')
    .setVersion('1.0')
    .addTag('nest')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // ======================================================================
  // Middlewares
  // ======================================================================
  app.use(cookieParser());

  await app.listen(configService.get('PORT'));
}

// runInCluster(bootstrap);
bootstrap();
