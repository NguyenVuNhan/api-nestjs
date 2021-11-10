import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  title: string;

  @IsString({ each: true })
  @IsNotEmpty()
  paragraphs: string[];
}
