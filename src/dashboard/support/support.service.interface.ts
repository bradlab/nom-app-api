import { IDateFilter } from 'app/param.input.dto';
import { Staff } from '../_shared/model/staff.model';
import { SupportStatusEnum, SupportTicket, SupportTypeEnum } from 'dashboard/_shared/model/support.model';
import { Client } from 'dashboard/_shared/model/client.model';

export interface ICreateSupportDTO {
  clientID: string;
  message: string;
  type: SupportTypeEnum;
  client?: Client;
}

export interface ISupportQuery extends IDateFilter {
  page?: number;
  limit?: number;
  status?: SupportStatusEnum;
  type?: SupportTypeEnum;
  agentID?: string;
  clientID?: string;
}

export interface IUpdateSupportDTO extends Partial<ICreateSupportDTO> {
  id: string;
}

export interface IChangeStatusDTO {
  ids: string[],
  status: SupportStatusEnum,
  agentID?: string;
}

export abstract class ISupportService {

  abstract add(client: Staff, data: ICreateSupportDTO): Promise<SupportTicket>;
  abstract bulk(client: Staff, data: ICreateSupportDTO[]): Promise<SupportTicket[]>;

  abstract fetchAll(param?: ISupportQuery): Promise<SupportTicket[]>;
  abstract fetchOne(id: string): Promise<SupportTicket>;

  abstract edit(data: Partial<ICreateSupportDTO>): Promise<SupportTicket>;

  abstract setState(data: IChangeStatusDTO) : Promise<boolean>;

  abstract remove(ids: string[]): Promise<boolean>;
}
