import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { BasicPersonnalInfoDTO } from 'adapter/param.dto';

export class RegisterStaffDTO extends BasicPersonnalInfoDTO {

  @ApiProperty({
    type: String,
    name: 'username',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  username?: string;

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
    name: 'avatar',
    required: false,
  })
  // @IsOptional()
  // @IsString()
  // @IsNotEmpty()
  avatar: string;
}
