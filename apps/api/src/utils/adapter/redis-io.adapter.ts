import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { RedisClient } from 'redis';
import { ServerOptions } from 'socket.io';
import { createAdapter } from 'socket.io-redis';

export class RedisIoAdapter extends IoAdapter {
  private redisAdapter: any;

  constructor(app: INestApplication) {
    super(app);
    const configService = app.get(ConfigService);
    const redisHost = configService.get('REDIS_HOST');
    const redisPort = configService.get('REDIS_PORT');
    const pubClient = new RedisClient({ host: redisHost, port: redisPort });
    const subClient = pubClient.duplicate();
    this.redisAdapter = createAdapter({ pubClient, subClient });
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.redisAdapter);
    return server;
  }
}
