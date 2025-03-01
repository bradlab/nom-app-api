import { ITimestamp } from 'domain/interface';
import { SexEnum } from 'app/enum/global.enum';
import { MaritalStatusEnum } from 'app/enum';

export class Person extends ITimestamp {
  id: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  avatar?: string;
  sex?: SexEnum;
  nationality?: string;
  religion?: string;
  maritalStatus?: MaritalStatusEnum;
  isActivated?: boolean;
}

export interface IPerson extends Person {
  fullName?: string;
}
