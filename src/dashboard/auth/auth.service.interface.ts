import { PartialDeep } from 'domain/types';
import { Staff } from 'dashboard/_shared/model/staff.model';
import { IBasicPersonnalInfoDTO } from 'app/person.input.dto';

export interface ICreateStaffDTO extends IBasicPersonnalInfoDTO {
  avatar?: string;
  fullname?: string;
}
export interface IRegisterStafftDTO extends ICreateStaffDTO {
  password: string;
  fullname?: string;
  deviceToken?: string;
}
export interface ISignedStaffDTO {
  user: Staff;
  deviceToken?: string;
  accessToken: string;
}
export interface IStaffQuery {
  ids?: string[];
  email?: string;
  phone?: string;
}
export interface IResetPasswordDTO extends ISigninAccoutDTO {
  otpCode: string;
}

export interface ISigninAccoutDTO {
  email?: string;
  phone?: string;
  deviceToken?: string;
  password: string;
}
export interface ISignedDTO {
  user: Staff;
  deviceToken?: string;
  accessToken: string;
}
export interface IUserQuery {
  ids?: string[];
  email?: string;
  phone?: string;
}
export interface LogoutDTO {
  deviceToken?: string;
}
export interface IForgotPasswordDTO {
  email?: string;
  phone?: string;
}
export interface IResetPasswordDTO extends ISigninAccoutDTO {
  otpCode: string;
}
export interface ISigninAccoutDTO {
  email?: string;
  phone?: string;
  deviceToken?: string;
  password: string;
}
export interface IForgotPasswordDTO {
  email?: string;
  phone?: string;
}
export interface LogoutDTO {
  deviceToken?: string;
}
export interface IUpdatePwdDTO {
  oldPassword: string;
  newPassword: string;
}

export abstract class IAuthService {
  abstract signup(data: IRegisterStafftDTO): Promise<ISignedStaffDTO>;
  abstract signin(data: ISigninAccoutDTO): Promise<ISignedStaffDTO>;

  abstract checkEmail(email: string): Promise<boolean>;

  abstract checkPhone(phone: string): Promise<boolean>;

  abstract updatePassword(user: Staff, data: IUpdatePwdDTO): Promise<boolean>;

  abstract forgotPassword(data: IForgotPasswordDTO): Promise<string>;

  abstract resetPassword(data: IResetPasswordDTO): Promise<boolean>;

  abstract search(data: PartialDeep<Staff>): Promise<Staff>;
}
