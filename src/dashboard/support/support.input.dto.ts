import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsUUID,
  IsOptional,
} from 'class-validator';

import { ISupportQuery, ICreateSupportDTO, IChangeStatusDTO } from './support.service.interface';
import { SupportStatusEnum, SupportTypeEnum } from 'dashboard/_shared/model/support.model';
import { DateFilterDTO } from 'adapter/param.dto';

export class CreateSupportDTO implements ICreateSupportDTO {

  @ApiProperty({ name: 'message'})
  @IsString()
  message: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsUUID()
  clientID: string;

  @ApiProperty({ type: String, enum: SupportTypeEnum })
  @IsString()
  @IsEnum(SupportTypeEnum)
  type: SupportTypeEnum;
}

export class ChangeSupportStatusDTO implements IChangeStatusDTO {
  @ApiProperty({
    type: String,
    isArray: true,
    name: 'ids',
    description: 'Liste des ID du modele concerné',
  })
  @IsString({ each: true })
  @IsUUID(undefined, { each: true })
  ids: string[];

  @ApiProperty({ type: String, enum: SupportStatusEnum })
  @IsString()
  @IsEnum(SupportStatusEnum)
  status: SupportStatusEnum;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  @IsUUID()
  agentID?: string;
}

export class UpdateSupportDTO extends PartialType(CreateSupportDTO) {
  @ApiProperty({ name: 'id' })
  @IsString()
  @IsUUID()
  id: string;
}

export class SupportQueryDTO extends DateFilterDTO implements ISupportQuery {
  @ApiProperty({ type: String, name: 'id', required: false })
  @IsOptional()
  @IsString()
  @IsUUID()
  id?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  @IsUUID()
  agentID?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  @IsUUID()
  clientID?: string;

  @ApiProperty({ type: String, required: false, enum: SupportStatusEnum })
  @IsOptional()
  @IsString()
  @IsEnum(SupportStatusEnum)
  status?: SupportStatusEnum;

  @ApiProperty({ type: String, required: false, enum: SupportTypeEnum })
  @IsOptional()
  @IsString()
  @IsEnum(SupportTypeEnum)
  type?: SupportTypeEnum;
}
