import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { BasicPersonnalInfoDTO } from 'adapter/param.dto';
import { IRegisterClienttDTO } from './auth.service.interface';

export class RegisterClientDTO extends BasicPersonnalInfoDTO implements IRegisterClienttDTO {

  @ApiProperty({
    type: String,
    name: 'labelName',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  labelName: string;

  @ApiProperty({
    type: String,
    name: 'city',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    type: String,
    name: 'NIF',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  NIF: string;

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
