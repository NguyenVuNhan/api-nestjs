import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/authentication/guard/jwtAuthentication.guard';
import { CreateSubscriberDto } from 'src/subscribers/dto/create-subscriber.dto';
import { ClientProxy } from '@nestjs/microservices';

@Controller('subscribers')
export class SubscribersController {
  constructor(
    @Inject('SUBSCRIBERS_SERVICE') private subscribersService: ClientProxy,
  ) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  async getSubscribers() {
    return this.subscribersService.send(
      {
        cmd: 'get-all-subscribers',
      },
      '',
    );
  }

  @Post()
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
