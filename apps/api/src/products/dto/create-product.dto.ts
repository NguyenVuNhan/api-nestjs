import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import ObjectWithIdDTO from '../../utils/dto/objectWithId.dto';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateNested()
  @Type(() => ObjectWithIdDTO)
  category: ObjectWithIdDTO;
}

export default CreateProductDto;
