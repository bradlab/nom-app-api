import { IsEnum, IsNumber, IsUUID, IsOptional, IsDateString, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { SubscriptionTypeEnum } from 'dashboard/_shared/model/subscription.model';
import { ICreateSubscriptionDTO, ISubscriptionQuery, IUpdateSubscriptionDTO } from './subscription.service.interface';

export class CreateSubscriptionDTO implements ICreateSubscriptionDTO {
  @ApiProperty({ name: 'clientID', description: 'ID du client' })
  @IsString()
  @IsUUID()
  clientID: string;

  @ApiProperty({ enum: SubscriptionTypeEnum, description: "Type d'abonnement" })
  @IsEnum(SubscriptionTypeEnum)
  type: SubscriptionTypeEnum;

  @ApiProperty({ description: "Date de début de l'abonnement", required: false })
  @IsOptional()
  @IsDateString()
  startDate: Date;

  @ApiProperty({ description: "Valeur en Méga-octets", required: false })
  @IsOptional()
  @IsNumber()
  value: number;

  @ApiProperty({ description: "Durée de l'abonnement en jours", required: false })
  @IsOptional()
  @IsNumber()
  duration: number;

  @ApiProperty({ description: "Prix de l'abonnement" })
  @IsNumber()
  price: number;
}

export class UpdateSubscriptionDTO extends PartialType(CreateSubscriptionDTO) implements IUpdateSubscriptionDTO {
    @ApiProperty({ description: "ID de l'abonnement" })
    @IsString()
    @IsUUID()
    id: string;

    @ApiProperty({ description: "ID de l'abonnement" })
    @IsOptional()
    @IsDateString()
    endDate: Date;
}

export class SubscriptionQueryDTO extends PartialType(UpdateSubscriptionDTO) implements ISubscriptionQuery {
    @ApiProperty({ name : 'from', description: 'Date de début de la période', required: false })
    @IsOptional()
    @IsDateString()
    from?: Date;

    @ApiProperty({description: 'Date de fin de la période', required: false })
    @IsOptional()
    @IsDateString()
    to?: Date;

    @ApiProperty({ name : 'date', required: false })
    @IsOptional()
    @IsDateString()
    date?: Date;
}