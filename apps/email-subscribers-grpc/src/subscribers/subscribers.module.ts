import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriber } from '@app/common/subscribers';
import { SubscribersService } from './subscribers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subscriber])],
  controllers: [SubscribersService],
})
export class SubscribersModule {}
