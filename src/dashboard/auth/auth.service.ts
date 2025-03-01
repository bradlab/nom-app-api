import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashFactory } from 'adapter/hash.factory';

import { DataGenerator } from 'domain/generator/data.generator';
import { PartialDeep } from 'domain/types';
import { IDashboardRepository } from '../_shared/dashboard.repository';
import {
  IForgotPasswordDTO,
  IAuthService,
  IRegisterStafftDTO,
  ISigninAccoutDTO,
  IUpdatePwdDTO,
} from './auth.service.interface';
import { Staff } from '../_shared/model/staff.model';
import { IResetPasswordDTO } from './auth.service.interface';
import { ISignedStaffDTO } from './auth.service.interface';
import { StaffFactory } from '../_shared/factory/staff.factory';

@Injectable()
export class AuthService implements IAuthService {
  private readonly logger = new Logger();
  constructor(
    private dashboardRepository: IDashboardRepository,
    private jwtService: JwtService,
  ) {}

  async signup(data: IRegisterStafftDTO): Promise<ISignedStaffDTO> {
    try {
      const { email, phone } = data;
      let existed: Staff = undefined as any;
      if (email) existed = await this.search({ email });
      if (phone) existed = await this.search({ phone });
      if (existed) {
        throw new ConflictException(
          'Employee account email or phone number allready exist',
        );
      }
      const user = await this.dashboardRepository.users.create(
        await StaffFactory.create(data),
      );
      return this.signin({ phone, password: data.password });
    } catch (error) {
      this.logger.error(error, 'ERROR::AuthService.add');
      throw error;
    }
  }

  async signin(data: ISigninAccoutDTO): Promise<ISignedStaffDTO> {
    try {
      const { phone, email } = data;
      const user = await this._validateUser(data);
      if (user) {
        return {
          accessToken: this.jwtService.sign({ phone, email, id: user.id }),
          user: user,
        };
      }
      throw new UnauthorizedException();
    } catch (error) {
      this.logger.error(error.message, 'ERROR::AuthService.signin');
      throw error;
    }
  }

  async checkEmail(email: string): Promise<boolean> {
    try {
      const user = await this.search({ email });
      return user ? true : false;
    } catch (error) {
      this.logger.error(error.message, 'ERROR::AuthService.checkEmail');
      throw error;
    }
  }

  async checkPhone(phone: string): Promise<boolean> {
    try {
      const user = await this.search({ phone });
      return user ? true : false;
    } catch (error) {
      this.logger.error(error.message, 'ERROR::AuthService.checkPhone');
      throw error;
    }
  }

  async updatePassword(staff: Staff, data: IUpdatePwdDTO): Promise<boolean> {
    try {
      const { oldPassword, newPassword } = data;
      const user = await this.search({ id: staff.id });
      if (user) {
        if (await HashFactory.isRightPwd(oldPassword, user.password!)) {
          user.password = await HashFactory.hashPwd(newPassword);
          return await this.dashboardRepository.users
            .update(user)
            .then(() => true);
        }
        throw new UnauthorizedException();
      }
      throw new NotFoundException('User not found');
    } catch (error) {
      this.logger.error(error.message, 'ERROR::AuthService.updatePassword');

      throw error;
    }
  }

  async forgotPassword(data: IForgotPasswordDTO): Promise<string> {
    try {
      const user = await this.search(data);
      if (user) {
        user.code = DataGenerator.randomNumber();
        return await this.dashboardRepository.users
          .update(user)
          .then(() => user.code) as any;
      }
      throw new NotFoundException('User not found');
    } catch (error) {
      this.logger.error(error.message, 'ERROR::AuthService.forgotPassword');
      throw error;
    }
  }

  async resetPassword(data: IResetPasswordDTO): Promise<boolean> {
    try {
      const { phone, password, otpCode } = data;
      const user = await this.search({ phone });
      if (user /* && otpCode && user?.code === otpCode */) { // TODO: remettre
        user.code = null as any;
        user.password = await HashFactory.hashPwd(password);
        return await this.dashboardRepository.users
          .update(user)
          .then(() => true);
      }
      return false;
    } catch (error) {
      this.logger.error(error.message, 'ERROR::AuthService.resetPassword');
      throw error;
    }
  }

  private async _validateUser(data: ISigninAccoutDTO): Promise<Staff> {
    const { phone, password } = data;
    const user = await this.search({ phone, isActivated: true });
    if (user && (await HashFactory.isRightPwd(password, user.password))) {
      return user;
    }
    return null as any;
  }

  async search(data: PartialDeep<Staff>): Promise<Staff> {
    try {
      const { email, phone, isActivated, id } = data;
      let options = {};
      if (id) options['id'] = id;
      if (isActivated) options['isActivated'] = isActivated;
      if (phone) {
        options['phone'] = phone;
      } else if (email) {
        options['email'] = email;
      } else {
        options = { ...data };
      }
      const user = await this.dashboardRepository.users.findOne({
        where: { ...options },
      });
      return user;
    } catch (error) {
      this.logger.error(error, 'ERROR::AuthService.search');
      throw error;
    }
  }
}
