import { Person } from 'domain/interface/person.model';
import { RoleEnum, SexEnum } from 'app/enum';

export class Staff extends Person {
  fullname?: string;
  password: string;
  code?: string;
  avatar?: string;
  role: RoleEnum;
  // relation
}

export type OStaff = Partial<Staff>;

export interface SignedStaff extends OStaff {
  accessToken: string;
}
