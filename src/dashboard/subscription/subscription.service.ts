import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IDashboardRepository } from '../_shared/dashboard.repository';
import { ISubscription } from '../_shared/model/subscription.model';
import { ICreateSubscriptionDTO, ISubscriptionQuery, ISubscriptionService, IUpdateSubscriptionDTO } from './subscription.service.interface';
import { DataHelper } from '../../_shared/adapter/helper/data.helper';
import { Staff } from '../_shared/model/staff.model';
import { SubscriptionFactory } from '../_shared/factory/subscription.factory';
import { DeepQueryType } from 'domain/types';
import { isValidDates, getDates, isCorrectRange, setPrevOrNextDate } from 'util/date.helper';
import { IDateFilter } from 'app/param.input.dto';
import { ITaskService } from 'task/task.service.interface';

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  private readonly logger = new Logger();

  constructor(
    private dashboardRepository: IDashboardRepository,
    @Inject(forwardRef(() => ITaskService))
    private taskService: ITaskService,
  ) {}

  async editManySubscriptions(subs: ISubscription[]): Promise<void> {
    try {
      if (DataHelper.isNotEmptyArray(subs)) {
        await this.dashboardRepository.subscriptions.updateMany(subs);
      }
    } catch (error) {
      this.logger.error(error, 'ERROR::SubscriptionService.fetchAll');
    }
  }

  async fetchAll(param: ISubscriptionQuery): Promise<ISubscription[]> {
    try {
      let dates: IDateFilter = { from: undefined, to: undefined };
      let queryParam: DeepQueryType<ISubscription> | DeepQueryType<ISubscription>[] = {};
      if (!DataHelper.isEmpty(param) && param) {
        const {
          type, 
          clientID, 
          subscriptionID, 
          isActivated, 
          from,
          to,
          date
        } = param;
        if (subscriptionID) queryParam = {...queryParam, id: subscriptionID};
        if (isActivated) queryParam = {...queryParam, isActivated};
        if (type) queryParam = {...queryParam, type};
        if (clientID) queryParam = {...queryParam, client: {id: clientID}};

        if (date) {
          if (!isValidDates([date])) {
            throw new BadRequestException(
              "La date de filtrage n'est pas correte",
            );
          }
          dates = getDates(new Date(date).toISOString());
        } else if (from && to) {
          if (isValidDates([from, to]) && from === to) {
            dates = getDates(new Date(from).toISOString());
          } else if (
            !isValidDates([from, to]) ||
            !isCorrectRange(from, to, false)
          ) {
            throw new BadRequestException('La plage de date est incorrecte');
          } else {
            dates.from = setPrevOrNextDate(from, true);
            dates.to = setPrevOrNextDate(to, true);
          }
        }
      }
      return await this.dashboardRepository.subscriptions.find({
        relations: { client: true, },
        where: { ...queryParam },
      });
    } catch (error) {
      this.logger.error(error, 'ERROR::SubscriptionService.fetchAll');
      throw error;
    }
  }

  async add(_: Staff, data: ICreateSubscriptionDTO): Promise<ISubscription> {
    try {
      const client = await this.dashboardRepository.clients.findOne({
        where: { id: data.clientID },
      });
      if (!client) {
        throw new NotFoundException('Client not found');
      }
  
      return await this.dashboardRepository.subscriptions.create(
        SubscriptionFactory.create(data, client),
      ).then((subscription ) => {
        this.taskService.addSubscriptionExpiryCron(subscription);
        return subscription;
      });
    } catch (error) {
      this.logger.error(error, 'ERROR::SubscriptionService.add');
      throw error;
    }
  }

  // Méthode de pagination inchangée

  async fetchOne(id: string): Promise<ISubscription> {
    try {
      return await this.dashboardRepository.subscriptions.findOne({
        relations: { client: true },
        where: { id },
      });
    } catch (error) {
      this.logger.error(error, 'ERROR::SubscriptionService.fetchOne');
      throw error;
    }
  }

  async bulk(user: Staff, datas: ICreateSubscriptionDTO[]): Promise<ISubscription[]> {
    try {
      const subscriptions: ISubscription[] = [];
      for (const data of datas) {
        const subscription = await this.add(user, data);
        subscriptions.push(subscription);
      }
      return subscriptions;
    } catch (error) {
      this.logger.error(error, 'ERROR::SubscriptionService.bulk');
      throw error;
    }
  }

  async edit(data: IUpdateSubscriptionDTO): Promise<ISubscription> {
    try {
      const subscription = await this.dashboardRepository.subscriptions.findOne({
        where: { id: data.id },
      });
      if (!subscription) {
        throw new NotFoundException('Subscription not found');
      }
  
      return await this.dashboardRepository.subscriptions.update(SubscriptionFactory.update(data, subscription));
    } catch (error) {
      this.logger.error(error, 'ERROR::SubscriptionService.edit');
      throw error;
    }
  }

  async setState(ids: string[]): Promise<boolean> {
    const subscriptions = await this.dashboardRepository.subscriptions.findByIds(ids);
    if (!subscriptions.length) {
      throw new NotFoundException('Subscription not found');
    }
    subscriptions.map((subscription ) => subscription.isActivated = !subscription.isActivated );
    return await this.dashboardRepository.subscriptions.updateMany(subscriptions).then(() => true);
  }

  async remove(ids: string[]): Promise<boolean> {
    try {
      const subscriptions = await this.dashboardRepository.subscriptions.findByIds(ids);
      if (DataHelper.isNotEmptyArray(subscriptions)) {
        await this.dashboardRepository.subscriptions.removeMany(subscriptions);
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(error, 'ERROR::SubscriptionService.remove');
      throw error;
    }
  }
}
