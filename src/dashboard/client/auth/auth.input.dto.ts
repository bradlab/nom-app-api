import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { BasicPersonnalInfoDTO } from 'adapter/param.dto';

export class RegisterClientDTO extends BasicPersonnalInfoDTO {

  @ApiProperty({
    type: String,
    name: 'password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: String,
    format: 'binary',
    name: 'logo',
    required: false,
  })
  // @IsOptional()
  // @IsString()
  // @IsNotEmpty()
  logo: string;
}
