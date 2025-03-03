import { ISubscription, SubscriptionTypeEnum } from '../_shared/model/subscription.model';
import { Staff } from '../_shared/model/staff.model';
import { Client } from 'dashboard/_shared/model/client.model';
import { IDateFilter } from 'app/param.input.dto';

export interface ICreateSubscriptionDTO {
  clientID: string;
  type: SubscriptionTypeEnum;
  startDate?: Date;
  value: number;
  duration?: number;
  price: number;
  client?: Client;
}

export interface ISubscriptionQuery extends IDateFilter {
  type?: SubscriptionTypeEnum;
  subscriptionID?: string;
  clientID?: string;
  isActivated?: boolean;
}

export interface IUpdateSubscriptionDTO extends Partial<ICreateSubscriptionDTO> {
  id: string;
  endDate?: Date;
}

export abstract class ISubscriptionService {
  abstract add(user: Staff, data: ICreateSubscriptionDTO): Promise<ISubscription>;

  abstract fetchAll(param: ISubscriptionQuery): Promise<ISubscription[]>;

  abstract fetchOne(id: string): Promise<ISubscription>;

  abstract editManySubscriptions(sub: ISubscription[]): Promise<void>;

  abstract bulk(user: Staff, datas: ICreateSubscriptionDTO[]): Promise<ISubscription[]>;

  abstract edit(data: IUpdateSubscriptionDTO): Promise<ISubscription>;

  abstract setState(ids: string[]): Promise<boolean>;
  
}
