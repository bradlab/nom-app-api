import { ApiProperty } from '@nestjs/swagger';
import { MaritalStatusEnum } from 'app/enum';
import { SexEnum } from 'app/enum/global.enum';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';
import { User } from 'domain/interface';

export class DocUserDTO implements Partial<User> {
  @ApiProperty({ type: String, name: 'id' })
  id: string;

  @ApiProperty({ type: String, name: 'matricule' })
  matricule: string;

  @ApiProperty({
    type: String,
    name: 'firstname',
    description: 'The familly name of the account',
  })
  @IsString()
  firstname: string;

  @ApiProperty({
    type: String,
    name: 'lastname',
    description: 'Le prénoms de la personne',
  })
  @IsString()
  lastname: string;

  @ApiProperty({ type: String, enum: SexEnum, name: 'sex', required: false })
  @IsOptional()
  @IsEnum(SexEnum)
  sex?: SexEnum;

  @ApiProperty({
    type: String,
    name: 'email',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    type: String,
    name: 'phone',
  })
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    type: String,
    name: 'address',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    type: String,
    name: 'country',
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    type: String,
    name: 'maritalStatus',
    enum: MaritalStatusEnum,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEnum(MaritalStatusEnum)
  maritalStatus?: MaritalStatusEnum;

  @ApiProperty({ type: Date, name: 'createdAt' })
  createdAt: Date;

  @ApiProperty({ type: Date, name: 'updatedAt' })
  updatedAt: Date;
}
