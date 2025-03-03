import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsUUID,
  IsOptional,
} from 'class-validator';

import { IGlobalStatQuery } from './statistic.service.interface';
import { SupportStatusEnum, SupportTypeEnum } from 'dashboard/_shared/model/support.model';
import { DateFilterDTO } from 'adapter/param.dto';

export class GlobalStatQuery extends DateFilterDTO implements IGlobalStatQuery {
  @ApiProperty({ type: String, name: 'id', required: false })
  @IsOptional()
  @IsString()
  @IsUUID()
  id?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  @IsUUID()
  agentID?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  @IsUUID()
  subscriptionID?: string;

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
