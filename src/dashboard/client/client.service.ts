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
import { IClientQuery, IClientService, ICreateClientDTO, IUpdateClientDTO } from './client.service.interface';
import { IDashboardRepository } from '../_shared/dashboard.repository';
import { ClientFactory } from 'dashboard/_shared/factory/client.factory';
import { Client } from 'dashboard/_shared/model/client.model';
import { Staff } from 'dashboard/_shared/model/staff.model';
import { getDates, getIntervalDates } from 'util/date.helper';
import { PeriodUnitEnum } from 'app/enum';

@Injectable()
export class ClientService implements IClientService {
  private readonly logger = new Logger();
  constructor(
    private dashboardRepository: IDashboardRepository,
  ) {}

  async fetchAll(param?: IClientQuery): Promise<Client[]> {
    if (!DataHelper.isEmpty(param) && param) {
      let queryParam: DeepQueryType<Client> | DeepQueryType<Client>[] = {};
      const { ids } = param!;
      if (DataHelper.isNotEmptyArray(ids!)) {
        if (typeof ids === 'string') {
          param!.ids = [ids];
        }
        queryParam = { ...queryParam, id: VIn(param!.ids!) };
      }
      if (!DataHelper.isEmpty(queryParam)) {
        return await this.dashboardRepository.clients.find({
          relations: {subscriptions: true, supports: true},
          where: { ...queryParam },
          order: { createdAt: 'DESC' },
        });
      }

      return [];
    }
    return await this.dashboardRepository.clients.find({
      relations: {subscriptions: true, supports: true},
      order: { createdAt: 'DESC' },
    });
  }

  async getClientsWithExpiringSubscriptions(weeks: number): Promise<Client[]> {
    const expiryDate = getIntervalDates(2, true, PeriodUnitEnum.WEEK)?.to;

    const clients = await this.dashboardRepository.clients.find({
      relations: {subscriptions: true},
    });

    return clients.map((client) => {
      const expiringSubscription = client.subscriptions?.find(
        (subscription) =>
          subscription.endDate <= expiryDate && subscription.isActivated,
      );
      return {
        ...client,
        isExpiring: !!expiringSubscription,
      };
    });
  }

  async search(data: PartialDeep<Client>): Promise<Client> {
    try {
      return this.dashboardRepository.clients.findOne({where: data});
    } catch (error) {
      this.logger.error(error, 'ERROR::ClientService.search');
      throw error;
    }
  }

  async fetchOne(id: string): Promise<Client> {
    return await this.dashboardRepository.clients.findOne({
      relations: { subscriptions: {client: true}, supports: {client: true} },
      where: { id },
    });
  }

  async add(data: ICreateClientDTO): Promise<Client> {
    try {
      const { email, phone } = data;
      let existed: Client;
      if (email) existed = await this.search({ email });
      if (phone) existed = await this.search({ phone });
      if (existed!) {
        throw new ConflictException(
          'Business account email or phone number allready exist',
        );
      }
      const client = await this.dashboardRepository.clients.create(
        await ClientFactory.create(data),
      ).then((rep) => {
        // Send password by email or sms
        return rep;
      });
      return client;
    } catch (error) {
      this.logger.error(error, 'ERROR::ClientService.add');
      throw error;
    }
  }

  async edit(data: IUpdateClientDTO): Promise<Client> {
    try {
      const { id } = data;
      const user = await this.fetchOne(id);
      if (user) {
        const userInstance = ClientFactory.update(user, data);
        return await this.dashboardRepository.clients.update(userInstance);
      }
      throw new NotFoundException('Client not found');
    } catch (error) {
      this.logger.error(error.message, 'ERROR::ClientService.editUser');

      throw error;
    }
  }

    async bulk(staff: Staff, datas: ICreateClientDTO[]): Promise<Client[]> {
      try {
        // Vérifier si une annonce avec le même titre existe déjà
        const clients: Client[] = [];
        if (DataHelper.isNotEmptyArray(datas)) {
          if (!staff) {
            throw new NotFoundException('Client not found');
          }
          for (const data of datas) {
            const { phone } = data;
            let queryParam: DeepQueryType<Client> | DeepQueryType<Client>[] = {};
            if (phone) queryParam = { ...queryParam, phone };
            const existingClient = await this.dashboardRepository.clients.findOne({
              where: queryParam,
            });
            if(!existingClient) {
              clients.push(await ClientFactory.create(data));
            }
          }
        }
        if (DataHelper.isNotEmptyArray(clients)) {
  
          return await this.dashboardRepository.clients.createMany(clients );
        }
        return [];
      } catch (error) {
        this.logger.error(error, 'ERROR::ClientService.add');
        throw error;
      }
    }
  

  async setState(ids: string[]): Promise<boolean> {
    try {
      const clients = ids && (await this.dashboardRepository.clients.findByIds(ids));
      if (clients?.length > 0) {
        clients.map((user) => user.isActivated = !user.isActivated );
        return await this.dashboardRepository.clients
          .updateMany(clients)
          .then(() => true);
      }
      return false;
    } catch (error) {
      this.logger.error(error, 'ERROR::ClientService.setState');
      return false;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const user = await this.fetchOne(id);
      if (user) {
        return await this.dashboardRepository.clients
          .remove(user)
          .then(() => true);
      }
      return false;
    } catch (error) {
      this.logger.error(error.message, 'ERROR::ClientService.remove');
      throw error;
    }
  }
  async clean(): Promise<boolean> {
    try {
      throw new NotImplementedException();
    } catch (error) {
      this.logger.error(error.message, 'ERROR::ClientService.remove');
      throw error;
    }
  }
}
