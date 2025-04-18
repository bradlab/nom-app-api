import { ITimestamp } from 'domain/interface';
import { MaritalStatusEnum, SexEnum } from 'app/enum';

export class Person extends ITimestamp {
  id: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  sex?: SexEnum;
  maritalStatus?: MaritalStatusEnum;
  isBusiness?: boolean;
  isActivated?: boolean;
}

export interface IPerson extends Person {
  fullName?: string;
}
