import {
  Injectable,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { IDashboardRepository } from '../_shared/dashboard.repository';
import { DataHelper } from '../../_shared/adapter/helper/data.helper';
import { DeepQueryType } from 'domain/types';
import { IGlobalStat, IGlobalStatQuery, IStatisticService } from './statistic.service.interface';
import { SupportTicket } from 'dashboard/_shared/model/support.model';
import { isValidDates, getDates, isCorrectRange, setPrevOrNextDate } from 'util/date.helper';
import { IDateFilter } from 'app/param.input.dto';
import { VBetween, VLike } from 'framework/orm.clauses';
import { Client } from 'dashboard/_shared/model/client.model';
import { ISubscription } from 'dashboard/_shared/model/subscription.model';

@Injectable()
export class StatisticService implements IStatisticService {
  private readonly logger = new Logger();
  constructor(private dashboardRepository: IDashboardRepository) {}

  async fetchAll(param?: IGlobalStatQuery): Promise<IGlobalStat> {
    try {
      let dates: IDateFilter = { from: undefined, to: undefined };
      let supportParam: DeepQueryType<SupportTicket> | DeepQueryType<SupportTicket>[] = {};
      let subscriptionParam: DeepQueryType<ISubscription> | DeepQueryType<ISubscription>[] = {};
      let clientParam: DeepQueryType<Client> | DeepQueryType<Client>[] = {};

      if (!DataHelper.isEmpty(param) && param) {
        const { agentID, clientID, date, from, status, to, type, country} = param;
        if (agentID) supportParam = {...supportParam, agent: {id: agentID}};
        if (clientID) {
          clientParam = {...clientParam, id: clientID}
          supportParam = {...supportParam, client: clientParam}
          subscriptionParam = {...subscriptionParam, client: clientParam}
        };
        if (country) {
          clientParam = {...clientParam, country: VLike(country)}
          subscriptionParam = {...subscriptionParam, client: clientParam}
          supportParam = {...supportParam, client: clientParam}
        }
        if (type) supportParam = {...supportParam, type};
        if (status) supportParam = {...supportParam, status};
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
      if (dates.from && dates.to) {
        supportParam = {
          ...supportParam,
          createdAt: VBetween(dates.from, dates.to),
        }
        clientParam = {
          ...clientParam,
          createdAt: VBetween(dates.from, dates.to),
        }
        subscriptionParam = {
          ...subscriptionParam,
          createdAt: VBetween(dates.from, dates.to),
        }
      }
      const supports = await this.dashboardRepository.supports.count({where: supportParam });
      const clients = await this.dashboardRepository.clients.count({where: clientParam });
      const subscriptions = await this.dashboardRepository.subscriptions.count({where: subscriptionParam });
      return {clients, subscriptions, supports};
    } catch (error) {
      this.logger.error(error, 'ERROR::SupportService.fetchAll');
      throw error;
    }
  }
}
