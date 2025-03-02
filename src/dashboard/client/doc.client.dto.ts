import { ApiProperty } from '@nestjs/swagger';
import { BasicPersonnalInfoDTO } from 'adapter/param.dto';
import { OClient } from 'dashboard/_shared/model/client.model';

export class DocClientDTO
  extends BasicPersonnalInfoDTO
  implements Partial<OClient>
{
  @ApiProperty({ type: String, name: 'id' })
  id: string;

  @ApiProperty({ type: String, name: 'NIF', required: false })
  NIF: string;

  @ApiProperty({ type: Boolean, name: 'isActivated' })
  isActivated: boolean;

  @ApiProperty({ type: Date, name: 'createdAt' })
  createdAt: Date;

  @ApiProperty({ type: Date, name: 'updatedAt' })
  updatedAt: Date;
}

export class DocSignedClientDTO extends DocClientDTO {
  @ApiProperty({ type: String, name: 'accessToken' })
  accessToken: string;
}
