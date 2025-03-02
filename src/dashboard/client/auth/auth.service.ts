import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashFactory } from 'adapter/hash.factory';
import { IDashboardRepository } from 'dashboard/_shared/dashboard.repository';
import { ClientFactory } from 'dashboard/_shared/factory/client.factory';
import { Client } from 'dashboard/_shared/model/client.model';
import { ISigninAccoutDTO, IUpdatePwdDTO, IForgotPasswordDTO } from 'dashboard/auth/auth.service.interface';

import { DataGenerator } from 'domain/generator/data.generator';
import { PartialDeep } from 'domain/types';
import { IClientAuthService, IRegisterClienttDTO, ISignedClientDTO } from './auth.service.interface';

@Injectable()
export class ClientAuthService implements IClientAuthService {
  private readonly logger = new Logger();
  constructor(
    private dashboardRepository: IDashboardRepository,
    private jwtService: JwtService,
  ) {}

  async signup(data: IRegisterClienttDTO): Promise<Client> {
    try {
      const { email, phone } = data;
      let existed: Client = undefined as any;
      if (email) existed = await this.search({ email });
      if (phone && !existed) existed = await this.search({ phone });
      if (existed) {
        throw new ConflictException(
          'Employee account email or phone number allready exist',
        );
      }
      data.password = await HashFactory.hashPwd(data.password);
      return await this.dashboardRepository.clients.create(
        ClientFactory.create(data),
      );
    } catch (error) {
      this.logger.error(error, 'ERROR::ClientAuthService.add');
      throw error;
    }
  }

  async signin(data: ISigninAccoutDTO): Promise<ISignedClientDTO> {
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
      this.logger.error(error.message, 'ERROR::ClientAuthService.signin');
      throw error;
    }
  }

  async checkEmail(email: string): Promise<boolean> {
    try {
      const user = await this.search({ email });
      return user ? true : false;
    } catch (error) {
      this.logger.error(error.message, 'ERROR::ClientAuthService.checkEmail');
      throw error;
    }
  }

  async checkPhone(phone: string): Promise<boolean> {
    try {
      const user = await this.search({ phone });
      return user ? true : false;
    } catch (error) {
      this.logger.error(error.message, 'ERROR::ClientAuthService.checkPhone');
      throw error;
    }
  }

  async updatePassword(Client: Client, data: IUpdatePwdDTO): Promise<boolean> {
    try {
      const { oldPassword, newPassword } = data;
      const user = await this.search({ id: Client.id });
      if (user) {
        if (await HashFactory.isRightPwd(oldPassword, user.password!)) {
          user.password = await HashFactory.hashPwd(newPassword);
          return await this.dashboardRepository.clients
            .update(user)
            .then(() => true);
        }
        throw new UnauthorizedException();
      }
      throw new NotFoundException('User not found');
    } catch (error) {
      this.logger.error(error.message, 'ERROR::ClientAuthService.updatePassword');

      throw error;
    }
  }

  async forgotPassword(data: IForgotPasswordDTO): Promise<boolean> {
    try {
      const user = await this.search(data);
      if (user) {
        const pwd = DataGenerator.randomString();
        user.password = await HashFactory.hashPwd(pwd);
        return await this.dashboardRepository.clients
          .update(user)
          .then(() => {
            // Send new password by email or sms
            return true;
          });
      }
      throw new NotFoundException('User not found');
    } catch (error) {
      this.logger.error(error.message, 'ERROR::ClientAuthService.forgotPassword');
      throw error;
    }
  }

  private async _validateUser(data: ISigninAccoutDTO): Promise<Client> {
    const { phone, password } = data;
    const user = await this.search({ phone, isActivated: true });
    if (user && (await HashFactory.isRightPwd(password, user.password))) {
      return user;
    }
    return null as any;
  }

  async search(data: PartialDeep<Client>): Promise<Client> {
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
      const user = await this.dashboardRepository.clients.findOne({
        where: { ...options },
      });
      return user;
    } catch (error) {
      this.logger.error(error, 'ERROR::ClientAuthService.search');
      throw error;
    }
  }
}
