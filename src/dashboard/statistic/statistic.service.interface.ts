import { IDateFilter } from 'app/param.input.dto';
import { SupportStatusEnum, SupportTypeEnum } from 'dashboard/_shared/model/support.model';

export interface IGlobalStatQuery extends IDateFilter {
  page?: number;
  limit?: number;
  status?: SupportStatusEnum;
  type?: SupportTypeEnum;
  subscriptionID?: string;
  agentID?: string;
  clientID?: string;
  country?: string;
}

export interface IGlobalStat {
  clients: number;
  subscriptions: number;
  supports: number;
}

export abstract class IStatisticService {

  abstract fetchAll(param?: IGlobalStatQuery): Promise<IGlobalStat>;
}
