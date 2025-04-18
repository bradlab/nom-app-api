import { ApiProperty } from '@nestjs/swagger';
import { BasicPersonnalInfoDTO } from 'adapter/param.dto';
import { OStaff } from '../_shared/model/staff.model';

export class DocStaffDTO
  extends BasicPersonnalInfoDTO
  implements Partial<OStaff>
{
  @ApiProperty({ type: String, name: 'id' })
  id: string;

  @ApiProperty({ type: Boolean, name: 'isActivated' })
  isActivated: boolean;

  @ApiProperty({ type: Date, name: 'createdAt' })
  createdAt: Date;

  @ApiProperty({ type: Date, name: 'updatedAt' })
  updatedAt: Date;

  askForReset: boolean;

  otpCode?: string;
}

export class DocSignedStaffDTO extends DocStaffDTO {
  @ApiProperty({ type: String, name: 'accessToken' })
  accessToken: string;
}
