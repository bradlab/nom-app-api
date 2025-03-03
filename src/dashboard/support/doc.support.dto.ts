import { ApiProperty } from '@nestjs/swagger';
import { OClient } from 'dashboard/_shared/model/client.model';
import { Staff } from 'dashboard/_shared/model/staff.model';
import { OSupportTicket, SupportStatusEnum, SupportTypeEnum } from 'dashboard/_shared/model/support.model';
import { DocClientDTO } from 'dashboard/client/doc.client.dto';
import { DocStaffDTO } from 'dashboard/manager/doc.staff.dto';

export class DocSupportDTO implements OSupportTicket {
  @ApiProperty({ type: String, name: 'id' })
  id: string;

  @ApiProperty({ type: DocClientDTO })
  client: OClient;

  @ApiProperty({ type: DocStaffDTO, required: false })
  agent?: Staff;  

  @ApiProperty({ type: String, required: false })
  object?: string;

  @ApiProperty({ type: String, required: false })
  message?: string;

  @ApiProperty({ type: String, enum: SupportTypeEnum })
  type: SupportTypeEnum;

  @ApiProperty({ type: String, enum: SupportStatusEnum })
  status: SupportStatusEnum;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
