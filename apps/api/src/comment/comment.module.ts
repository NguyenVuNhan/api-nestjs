import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCommentHandler } from './commands/handlers/create-comment.handler';
import { CommentController } from './comment.controller';
import Comment from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), CqrsModule],
  controllers: [CommentController],
  providers: [CreateCommentHandler],
})
export class CommentModule {}
