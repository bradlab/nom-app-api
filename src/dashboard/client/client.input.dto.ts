import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { IClientQuery, ICreateClientDTO } from './client.service.interface';

export class ClientAccoutDTO implements ICreateClientDTO {
  @ApiProperty({
    type: String,
    name: 'firstname',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstname?: string;

  @ApiProperty({
    type: String,
    name: 'lastname',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastname?: string;

  @ApiProperty({
    type: String,
    name: 'phone',
    description:
      "Le numéro de téléphone sur lequel contacter l'utilisateur du compte ou envoyer des informations OTP",
  })
  @IsString()
  @IsPhoneNumber()
  phone: string;

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
    name: 'NIF',
    description: "NIF de l'entreprise",
    required: false,
  })
  @IsOptional()
  @IsString()
  NIF?: string;

  @ApiProperty({
    type: String,
    name: 'city',
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

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
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    type: String,
    format: 'binary',
    name: 'logo',
    description: 'Logo du client',
    required: false,
  })
  logo?: string;

  @ApiProperty({
    type: String,
    name: 'password',
  })
  @IsString()
  password?: string;
}

export class UpdateClientDTO extends PartialType(ClientAccoutDTO) {
  @ApiProperty({
    type: String,
    name: 'id',
    description: 'ID of the given user',
  })
  @IsString()
  @IsUUID()
  id: string;
}

export class ClientQuerDTO implements IClientQuery {
  @ApiProperty({
    type: String,
    name: 'ids',
    isArray: true,
    description: 'Liste des ID des clients',
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
