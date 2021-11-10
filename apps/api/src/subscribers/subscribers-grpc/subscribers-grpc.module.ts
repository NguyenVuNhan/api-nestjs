import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { SubscribersGrpcController } from './subscribers-grpc.controller';

@Module({
  imports: [ConfigModule],
  controllers: [SubscribersGrpcController],
  providers: [
    {
      provide: 'SUBSCRIBERS_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: 'subscribers',
            protoPath: join(
              process.cwd(),
              'apps/common/grpc/subscribers.proto',
            ),
            url: configService.get('GRPC_CONNECTION_URL'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class SubscribersGrpcModule {}
