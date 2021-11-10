import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import JwtAuthenticationGuard from '../../authentication/guard/jwtAuthentication.guard';
import CreateSubscriberDto from '../dto/create-subscriber.dto';
import SubscribersService from '../subscribers.interface';

@Controller('subscribers')
export class SubscribersGrpcController {
  private subscribersService: SubscribersService;
  constructor(@Inject('SUBSCRIBERS_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.subscribersService =
      this.client.getService<SubscribersService>('SubscribersService');
  }

  @Get('grpc')
  async getSubscribers() {
    return this.subscribersService.getAllSubscribers({});
  }

  @Post('grpc')
  @UseGuards(JwtAuthenticationGuard)
  async createPost(@Body() subscriber: CreateSubscriberDto) {
    return this.subscribersService.addSubscriber(subscriber);
  }
}
