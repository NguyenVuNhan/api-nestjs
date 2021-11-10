import { CreateSubscriberDto } from '@app/common/subscribers';
import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { SubscribersService } from './subscribers.service';

@Controller()
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @MessagePattern({ cmd: 'add-subscriber' })
  addSubscriber(
    @Payload() subscriber: CreateSubscriberDto,
    @Ctx() context: RmqContext,
  ) {
    const newSubscriber = this.subscribersService.addSubscriber(subscriber);

    // Manually acknowledge the message
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);

    return newSubscriber;
  }

  @MessagePattern({ cmd: 'get-all-subscribers' })
  getAllSubscribers() {
    return this.subscribersService.getAllSubscribers();
  }
}
