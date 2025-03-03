import { PartialDeep } from 'domain/types';
import { Staff } from '../_shared/model/staff.model';
import { IStaffQuery } from 'dashboard/auth/auth.service.interface';
import { IRegisterStafftDTO } from 'dashboard/auth/auth.service.interface';
import { ICreateStaffDTO } from 'dashboard/auth/auth.service.interface';
export interface IUpdateStaffDTO extends Partial<ICreateStaffDTO> {
  id: string;
}

export abstract class IStaffService {

  abstract add(data: IRegisterStafftDTO): Promise<Staff>;

  abstract fetchAll(param?: IStaffQuery): Promise<Staff[]>;

  abstract search(
    data: PartialDeep<Staff>,
    withAccess?: boolean,
  ): Promise<Staff>;

  abstract fetchOne(id: string): Promise<Staff>;

  abstract edit(data: IUpdateStaffDTO): Promise<Staff>;

  abstract editCredential(
    user: Staff,
    data: Partial<IUpdateStaffDTO>,
  ): Promise<boolean>;

  abstract setState(ids: string[]): Promise<boolean>;

  abstract remove(id: string): Promise<boolean>;

  abstract clean(): Promise<boolean>;
}
