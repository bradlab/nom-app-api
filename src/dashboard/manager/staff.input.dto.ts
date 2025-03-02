import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { IStaffQuery } from 'dashboard/auth/auth.service.interface';
import { BasicPersonnalInfoDTO } from 'adapter/param.dto';

export class StaffAccoutDTO extends BasicPersonnalInfoDTO {
  @ApiProperty({
    type: String,
    name: 'fullName',
    description: "Raison de l'entreprise s'il s'agit",
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsString()
  fullName?: string;

  avatar?: string;
}

export class RegisterStaffDTO extends StaffAccoutDTO {
  @ApiProperty({
    type: String,
    name: 'password',
  })
  @IsString()
  password: string;
}

export class UpdateUserDTO extends PartialType(StaffAccoutDTO) {
  @ApiProperty({
    type: String,
    name: 'id',
    description: 'ID of the given user',
  })
  @IsString()
  @IsUUID()
  id: string;
}

export class UserQuerDTO implements IStaffQuery {
  @ApiProperty({
    type: String,
    name: 'ids',
    isArray: true,
    description: 'Liste des ID des utilisateurs',
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  @IsUUID(undefined, { each: true })
  ids: string[];

  @ApiProperty({
    type: String,
    name: 'email',
    description: 'email of the given user',
    required: false,
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    type: String,
    name: 'phone',
    description: 'phone number of the given user',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phone?: string;
}
