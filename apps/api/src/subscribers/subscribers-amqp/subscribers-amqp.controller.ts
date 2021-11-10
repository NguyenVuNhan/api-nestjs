import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import JwtAuthenticationGuard from '../../authentication/guard/jwtAuthentication.guard';
import CreateSubscriberDto from '../../subscribers/dto/create-subscriber.dto';

@Controller('subscribers')
export class SubscribersAmqpController {
  constructor(
    @Inject('SUBSCRIBERS_SERVICE') private subscribersService: ClientProxy,
  ) {}

  @Get('amqp')
  @UseGuards(JwtAuthenticationGuard)
  async getSubscribers() {
    return this.subscribersService.send(
      {
        cmd: 'get-all-subscribers',
      },
      '',
    );
  }

  @Post('amqp')
  @UseGuards(JwtAuthenticationGuard)
  async createPost(@Body() subscriber: CreateSubscriberDto) {
    // Change to emit can improve the speend but it doesn't return any result
    return this.subscribersService.send(
      {
        cmd: 'add-subscriber',
      },
      subscriber,
    );
  }
}
