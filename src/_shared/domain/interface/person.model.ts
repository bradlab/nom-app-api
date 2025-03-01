import { ITimestamp } from 'domain/interface';
import { MaritalStatusEnum } from 'app/enum';

export class Person extends ITimestamp {
  id: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  nationality?: string;
  religion?: string;
  maritalStatus?: MaritalStatusEnum;
  isActivated?: boolean;
}

export interface IPerson extends Person {
  fullName?: string;
}
