import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import GetCommentsDto from 'apps/api/src/comment/dto/get-comment.dto';
import { GetCommentsQuery } from 'apps/api/src/comment/queries/implementations/getComments.query';
import { RequestWithUser } from '../authentication/authentication.interface';
import JwtAuthenticationGuard from '../authentication/guard/jwtAuthentication.guard';
import { CreateCommentCommand } from './commands/implementations/create-comment.command';
import CreateCommentDto from './dto/create-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createComment(
    @Body() comment: CreateCommentDto,
    @Req() req: RequestWithUser,
  ) {
    const user = req.user;
    return this.commandBus.execute(new CreateCommentCommand(comment, user));
  }

  @Get()
  async getComments(@Query() { postId }: GetCommentsDto) {
    return this.queryBus.execute(new GetCommentsQuery(postId));
  }
}
