import {
  Logger,
  Injectable,
  ConflictException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';

import { DataHelper } from 'adapter/helper/data.helper';
import { DeepQueryType, PartialDeep } from 'domain/types';
import { VIn, VNot } from 'framework/orm.clauses';
import { Staff } from '../_shared/model/staff.model';
import { IStaffService, IUpdateStaffDTO } from './staff.service.interface';
import { IStaffQuery } from 'dashboard/auth/auth.service.interface';
import { IRegisterStafftDTO } from 'dashboard/auth/auth.service.interface';
import { IDashboardRepository } from '../_shared/dashboard.repository';
import { StaffFactory } from '../_shared/factory/staff.factory';
import { IAuthService } from '../auth/auth.service.interface';

@Injectable()
export class StaffService implements IStaffService {
  private readonly logger = new Logger();
  constructor(
    private dashboardRepository: IDashboardRepository,
    private authService: IAuthService,
  ) {}


  async fetchAll(param?: IStaffQuery): Promise<Staff[]> {
    if (!DataHelper.isEmpty(param) && param) {
      let queryParam: DeepQueryType<Staff> | DeepQueryType<Staff>[] = {};
      const { ids } = param!;
      if (DataHelper.isNotEmptyArray(ids!)) {
        if (typeof ids === 'string') {
          param!.ids = [ids];
        }
        queryParam = { ...queryParam, id: VIn(param!.ids!) };
      }
      if (!DataHelper.isEmpty(queryParam)) {
        return await this.dashboardRepository.users.find({
          where: { ...queryParam },
          order: { createdAt: 'DESC' },
        });
      }

      return [];
    }
    return await this.dashboardRepository.users.find({
      order: { createdAt: 'DESC' },
    });
  }

  async search(data: PartialDeep<Staff>): Promise<Staff> {
    try {
      return this.authService.search(data);
    } catch (error) {
      this.logger.error(error, 'ERROR::StaffService.search');
      throw error;
    }
  }

  async fetchOne(id: string): Promise<Staff> {
    return await this.dashboardRepository.users.findOne({
      where: { id },
    });
  }

  async add(data: IRegisterStafftDTO): Promise<Staff> {
    try {
      const { email, phone } = data;
      let existed: Staff;
      if (email) existed = await this.authService.search({ email });
      if (phone) existed = await this.authService.search({ phone });
      if (existed!) {
        throw new ConflictException(
          'Employee account email or phone number allready exist',
        );
      }
      const user = await this.dashboardRepository.users.create(
        await StaffFactory.create(data),
      );
      return user;
    } catch (error) {
      this.logger.error(error, 'ERROR::StaffService.add');
      throw error;
    }
  }

  async editCredential(
    user: Staff,
    data: IUpdateStaffDTO,
    isEdit?: boolean,
  ): Promise<boolean> {
    try {
      const staff = await this.fetchOne(user?.id);
      if (staff) {
        let existedUser: Staff;
        if (data.email) {
          existedUser = await this.dashboardRepository.users.findOne({
            where: { email: data.email, id: VNot(staff.id) },
          });
        }
        if (data.phone) {
          existedUser = await this.dashboardRepository.users.findOne({
            where: { phone: data.phone, id: VNot(staff.id) },
          });
        }
        if (existedUser!) {
          throw new ConflictException('Email or phone number allready exist');
        }
        if (isEdit) return true;
        const newUser = await this.dashboardRepository.users.update(
          StaffFactory.update(staff, data),
        );
        if (newUser) {
          return true;
        }
        return false;
      }
      throw new NotFoundException('Staff not found');
    } catch (error) {
      this.logger.error(error.message, 'ERROR::StaffService.editCredential');

      throw error;
    }
  }

  async edit(data: IUpdateStaffDTO): Promise<Staff> {
    try {
      const { id, phone, email } = data;
      const user = await this.fetchOne(id);
      let updateAll = false;
      if (user) {
        if (
          (email && email !== user.email) ||
          (phone && phone !== user.phone)
        ) {
          updateAll = await this.editCredential(
            user,
            { id, phone, email },
            true,
          );
        }
        const userInstance = StaffFactory.update(user, data, updateAll);
        return await this.dashboardRepository.users.update(userInstance);
      }
      throw new NotFoundException('Staff not found');
    } catch (error) {
      this.logger.error(error.message, 'ERROR::StaffService.editUser');

      throw error;
    }
  }

  async setState(ids: string[]): Promise<boolean> {
    try {
      const users = ids && (await this.dashboardRepository.users.findByIds(ids));
      if (users?.length > 0) {
        users.map((user) => {
          user.isActivated = !user.isActivated;
          return user;
        });
        return await this.dashboardRepository.users
          .updateMany(users)
          .then(() => true);
      }
      return false;
    } catch (error) {
      this.logger.error(error, 'ERROR::StaffService.setState');
      return false;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const user = await this.fetchOne(id);
      if (user) {
        return await this.dashboardRepository.users
          .remove(user)
          .then(() => true);
      }
      return false;
    } catch (error) {
      this.logger.error(error.message, 'ERROR::StaffService.remove');
      throw error;
    }
  }
  async clean(): Promise<boolean> {
    try {
      throw new NotImplementedException();
    } catch (error) {
      this.logger.error(error.message, 'ERROR::StaffService.remove');
      throw error;
    }
  }
}
