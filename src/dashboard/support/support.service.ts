import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { IDashboardRepository } from '../_shared/dashboard.repository';
import { DataHelper } from '../../_shared/adapter/helper/data.helper';
import { Staff } from '../_shared/model/staff.model';
import { DeepQueryType } from 'domain/types';
import { IChangeStatusDTO, ICreateSupportDTO, ISupportQuery, ISupportService, IUpdateSupportDTO } from './support.service.interface';
import { SupportFactory } from 'dashboard/_shared/factory/support.factory';
import { SupportStatusEnum, SupportTicket } from 'dashboard/_shared/model/support.model';
import { isValidDates, getDates, isCorrectRange, setPrevOrNextDate } from 'util/date.helper';
import { IDateFilter } from 'app/param.input.dto';
import { VArrayContains, VBetween, VIn } from 'framework/orm.clauses';
import { RoleEnum } from 'app/enum';

@Injectable()
export class SupportService implements ISupportService {
  private readonly logger = new Logger();
  constructor(private dashboardRepository: IDashboardRepository) {}

  async add(_: Staff, data: ICreateSupportDTO): Promise<SupportTicket> {
    try {
      const { clientID } = data;

      const client = await this.dashboardRepository.clients.findOne({
        where: { id: clientID },
      });

      if (!client) throw new NotFoundException('Client not found');

      return await this.dashboardRepository.supports.create(
        SupportFactory.create(data, client),
      );
    } catch (error) {
      this.logger.error(error, 'ERROR::SupportService.add');
      throw error;
    }
  }

  async bulk(user: Staff, datas: ICreateSupportDTO[]): Promise<SupportTicket[]> {
    try {
      const supports: SupportTicket[] = [];
      if (DataHelper.isNotEmptyArray(datas)) {
        if (!user) {
          throw new NotFoundException('User not found');
        }
        for (const data of datas) {
          const { clientID } = data;
          const client = await this.dashboardRepository.clients.findOne({
            where: {id: clientID},
          });
          if(client) {
            supports.push(SupportFactory.create(data, client));
          }
        }
      }
      if (DataHelper.isNotEmptyArray(supports)) {

        return await this.dashboardRepository.supports.createMany(supports );
      }
      return [];
    } catch (error) {
      this.logger.error(error, 'ERROR::SupportService.add');
      throw error;
    }
  }

  async fetchAll(param?: ISupportQuery): Promise<SupportTicket[]> {
    try {
      let dates: IDateFilter = { from: undefined, to: undefined };
      let queryParam: DeepQueryType<SupportTicket> | DeepQueryType<SupportTicket>[] = {};

      if (!DataHelper.isEmpty(param) && param) {
        const { page, limit, agentID, clientID, date, from, status, to, type } = param;
        if (agentID) queryParam = {...queryParam, agent: {id: agentID}};
        if (clientID) queryParam = {...queryParam, client: {id: clientID}};
        if (type) queryParam = {...queryParam, type};
        if (status) queryParam = {...queryParam, status};
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
        queryParam = {
          ...queryParam,
          createdAt: VBetween(dates.from, dates.to),
        }
      }
      return await this.dashboardRepository.supports.find({
        relations: { client: true, agent: true },
        where: queryParam,
        order: { updatedAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error(error, 'ERROR::SupportService.fetchAll');
      throw error;
    }
  }

  async setState(data: IChangeStatusDTO): Promise<boolean> {
    try {
      const {ids, status, agentID} = data;
      let agent;
      let queryParam: DeepQueryType<SupportTicket> | DeepQueryType<SupportTicket>[] = {};
      switch (status) {
        case SupportStatusEnum.ASSIGNED:
          queryParam = {status: SupportStatusEnum.PENDING}
          agent = await this.dashboardRepository.users.findOne({
            where: {
              id: agentID, isActivated: true, role: RoleEnum.SUPPORT
            }
          })
          break;
        case SupportStatusEnum.PROCESSING:
          queryParam = {status: SupportStatusEnum.ASSIGNED}
          break;
        case SupportStatusEnum.COMPLETED:
          queryParam = {status: SupportStatusEnum.PROCESSING}
          break;
        case SupportStatusEnum.EVALUATED:
          queryParam = {status: SupportStatusEnum.COMPLETED}
          break;
      
        default:
          break;
      }
      const supports = await this.dashboardRepository.supports.findByIds(ids, queryParam);
      if (DataHelper.isNotEmptyArray(supports)) {
        supports.map((support) => {
          support.status = status;
          if (agent) support.agent = agent;
        });
        return await this.dashboardRepository.supports.updateMany(supports).then(() => true);
      }
      return false;
    } catch (error) {
      this.logger.error(error, 'ERROR::SupportService.setState')
      throw error;
    }
  }

  async fetchOne(id: string): Promise<SupportTicket> {
    try {
      return await this.dashboardRepository.supports.findOne({
        relations: { client: true, agent: true },
        where: { id },
      });
    } catch (error) {
      this.logger.error(error, 'ERROR::SupportService.fetchOne');
      throw error;
    }
  }

  async edit(data: IUpdateSupportDTO): Promise<SupportTicket> {
    try {
      const {id} = data;
      const support = await this.fetchOne(data.id);
      if (!support) throw new NotFoundException('Annonce not found');

      return await this.dashboardRepository.supports.update(
        SupportFactory.update(data, support),
      );
    } catch (error) {
      this.logger.error(error, 'ERROR::SupportService.edit');
      throw error;
    }
  }

  async remove(ids: string[]): Promise<boolean> {
    try {
      const supports = await this.dashboardRepository.supports.findByIds(ids);
      if (DataHelper.isNotEmptyArray(supports)) {
        return await this.dashboardRepository.supports.removeMany(supports).then(() => true);
      }
      return false;
    } catch (error) {
      this.logger.error(error, 'ERROR::SupportService.remove');
      return false;
    }
  }
}
