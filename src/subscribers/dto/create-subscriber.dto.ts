import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateSubscriberDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  name: string;
}

export default CreateSubscriberDto;
