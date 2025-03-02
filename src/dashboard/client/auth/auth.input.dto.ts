import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsEnum,
  IsPhoneNumber,
} from 'class-validator';
import { IRegisterClienttDTO } from './auth.service.interface';
import { SexEnum } from 'app/enum';

export class RegisterClientDTO implements IRegisterClienttDTO {

  @ApiProperty({
    type: String,
    name: 'lastname',
    description: 'Le ou les prénom(s) de la personne',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({
    type: String,
    name: 'firstname',
    description: 'Le nom de la personne',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({
    type: String,
    name: 'phone',
    description:
      "Le numéro de téléphone sur lequel contacter l'utilisateur du compte ou envoyer des informations OTP",
  })
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ type: String, enum: SexEnum, name: 'sex', required: false })
  @IsOptional()
  @IsEnum(SexEnum)
  sex?: SexEnum;

  @ApiProperty({
    type: String,
    name: 'email',
    description:
      "L'adresse e-mail sur laquelle partagent certaines informations avec l'utilisateur par notification",
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    type: String,
    name: 'address',
    description: 'Adresse complète de la personne',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    type: String,
    name: 'country',
    description: 'Pays de résidence de la personne',
  })
  @IsString()
  @IsNotEmpty()
  country: string;

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
  })
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
  logo: string;
}
