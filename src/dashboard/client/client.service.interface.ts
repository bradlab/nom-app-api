import { PartialDeep } from 'domain/types';
import { Client } from 'dashboard/_shared/model/client.model';
import { Staff } from 'dashboard/_shared/model/staff.model';
import { IRegisterClienttDTO } from './auth/auth.service.interface';

export interface ICreateClientDTO extends Partial<IRegisterClienttDTO> {
  NIF?: string;
  city?: string;
  phone: string;
};
export interface IUpdateClientDTO extends Partial<ICreateClientDTO> {
  id: string;
}

export interface IClientQuery {
  ids?: string[];
  email?: string;
  phone?: string;
}

export abstract class IClientService {
  abstract add(data: ICreateClientDTO): Promise<Client>;

  abstract fetchAll(param?: IClientQuery): Promise<Client[]>;

  abstract search(
    data: PartialDeep<Client>,
    withAccess?: boolean,
  ): Promise<Client>;

  abstract bulk(staff: Staff, datas: ICreateClientDTO[]): Promise<Client[]>;

  abstract fetchOne(id: string): Promise<Client>;

  abstract edit(data: IUpdateClientDTO): Promise<Client>;

  abstract setState(ids: string[]): Promise<boolean>;

  abstract remove(id: string): Promise<boolean>;

  abstract clean(): Promise<boolean>;
}
