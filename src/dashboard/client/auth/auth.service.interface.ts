import { PartialDeep } from 'domain/types';
import { IBasicPersonnalInfoDTO } from 'app/person.input.dto';
import { Client } from 'dashboard/_shared/model/client.model';
import { ISigninAccoutDTO, IUpdatePwdDTO, IForgotPasswordDTO } from 'dashboard/auth/auth.service.interface';

export interface IRegisterClienttDTO extends IBasicPersonnalInfoDTO {
  password: string;
  logo?: string;
  deviceToken?: string;
}
export interface ISignedClientDTO {
  user: Client;
  deviceToken?: string;
  accessToken: string;
}
export interface IClientQuery {
  ids?: string[];
  email?: string;
  phone?: string;
}
export interface IUserQuery {
  ids?: string[];
  email?: string;
  phone?: string;
}

export abstract class IClientAuthService {
  abstract signup(data: IRegisterClienttDTO): Promise<Client>;
  abstract signin(data: ISigninAccoutDTO): Promise<ISignedClientDTO>;

  abstract checkEmail(email: string): Promise<boolean>;

  abstract checkPhone(phone: string): Promise<boolean>;

  abstract updatePassword(user: Client, data: IUpdatePwdDTO): Promise<boolean>;

  abstract forgotPassword(data: IForgotPasswordDTO): Promise<boolean>;

  abstract search(data: PartialDeep<Client>): Promise<Client>;
}
