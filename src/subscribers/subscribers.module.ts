import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SubscribersAmqpModule } from './subscribers-amqp/subscribers-amqp.module';
import { SubscribersGrpcModule } from './subscribers-grpc/subscribers-grpc.module';

@Module({
  imports: [ConfigModule, SubscribersGrpcModule, SubscribersAmqpModule],
})
export class SubscribersModule {}
