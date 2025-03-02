import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { BasicPersonnalInfoDTO } from 'adapter/param.dto';
import { IRegisterStafftDTO } from './auth.service.interface';
import { RoleEnum } from 'app/enum';

export class RegisterStaffDTO extends OmitType(BasicPersonnalInfoDTO, ['maritalStatus']) implements IRegisterStafftDTO {

  @ApiProperty({
    type: String,
    name: 'role',
    enum: RoleEnum,
  })
  @IsString()
  @IsEnum(RoleEnum)
  role: RoleEnum;

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
  avatar?: string;
}
