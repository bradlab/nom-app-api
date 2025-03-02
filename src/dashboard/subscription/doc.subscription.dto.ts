import { ApiProperty } from '@nestjs/swagger';
import { OSubscription, SubscriptionTypeEnum } from '../_shared/model/subscription.model';
import { OClient } from 'dashboard/_shared/model/client.model';
import { DocClientDTO } from 'dashboard/client/doc.client.dto';

export class DocSubscriptionDTO implements Partial<OSubscription> {
  @ApiProperty({ type: String, name: 'id' })
  id: string;

  @ApiProperty({ type: DocClientDTO, name: 'client' })
  client: OClient;

  @ApiProperty({
    name: "type",
    type: String,
    description: "Type d'abonnement",
    enum: SubscriptionTypeEnum,
  })
  type: SubscriptionTypeEnum;

  @ApiProperty({ type: Boolean, name: 'isActivated' })
  isActivated: boolean;

  @ApiProperty({ type: Date, name: 'closedAt' })
  closedAt: Date;

  @ApiProperty({ type: Date, name: 'createdAt' })
  createdAt: Date;

  @ApiProperty({ type: Date, name: 'updatedAt' })
  updatedAt: Date;
}
