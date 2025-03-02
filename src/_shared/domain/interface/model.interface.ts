import { MaritalStatusEnum } from 'app/enum';
import { SexEnum } from 'app/enum/global.enum';

export abstract class ITimestamp {
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface User extends ITimestamp {
  id: string;
  firstname: string;
  lastname: string;
  email?: string;
  phone: string;
  address?: string;
  country?: string;
  sex?: SexEnum;
  maritalStatus?: MaritalStatusEnum;
  isActivated: boolean;
}

export type OUser = Partial<User>;
