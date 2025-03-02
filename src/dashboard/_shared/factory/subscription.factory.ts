/* eslint-disable @typescript-eslint/no-unused-vars */
import { ISubscription, OSubscription, SubscriptionTypeEnum } from '../model/subscription.model';
import { DataHelper } from 'adapter/helper/data.helper';
import { ClientFactory } from './client.factory';
import { ICreateSubscriptionDTO, IUpdateSubscriptionDTO } from 'dashboard/subscription/subscription.service.interface';
import { Client } from '../model/client.model';
import { getIntervalDates } from 'util/date.helper';
import { PeriodUnitEnum } from 'app/enum';

export abstract class SubscriptionFactory {
  static create(data: ICreateSubscriptionDTO, client: Client): ISubscription {
    const subscription = new ISubscription();
    subscription.client = client;
    subscription.type = data.type;
    const {from, to} = this.getStartAndEndDate(data);
    subscription.startDate = data.startDate ? new Date(data.startDate) : from;
    subscription.endDate = to;
    
    subscription.price = data.price;
    subscription.value = data.value;
    subscription.duration = data.duration;

    return subscription;
  }
  static update(data: IUpdateSubscriptionDTO, subscription: ISubscription): ISubscription {
    if (subscription) {
      subscription.type = data.type || subscription.type;
      subscription.startDate = data.startDate || subscription.startDate;
      subscription.endDate = data.endDate || subscription.endDate;
      subscription.price = data.price || subscription.price;
      subscription.value = data.value || subscription.value;
      subscription.duration = data.duration || subscription.duration;
    }
    return subscription;
  }
  static getSubscription(subscription: ISubscription): OSubscription {
    if (subscription) {
      return {
        id: subscription.id,
        type: subscription.type,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        duration: subscription.duration,
        value: subscription.value,
        price: subscription.price,
        isActivated: subscription.isActivated,
        client: ClientFactory.getClient(subscription.client!),
        createdAt: subscription.createdAt,
        updatedAt: subscription.updatedAt,
      };
    }
    return null as any;
  }
  static getSubscriptions(subscriptions: ISubscription[]): OSubscription[] {
    if (DataHelper.isNotEmptyArray(subscriptions)) {
      return subscriptions.map((sub) => SubscriptionFactory.getSubscription(sub));
    }
    return [];
  }

  static getStartAndEndDate(data: ICreateSubscriptionDTO) : {from: Date, to: Date} {
    const {type, duration, startDate} = data;
    switch (type) {
      case SubscriptionTypeEnum.ANNUAL:
        return getIntervalDates(1, true, PeriodUnitEnum.YEAR, startDate);
      case SubscriptionTypeEnum.MONTHLY:
        return getIntervalDates(1, true, PeriodUnitEnum.MONTH, startDate);
      case SubscriptionTypeEnum.QUARTERLY:
        return getIntervalDates(3, true, PeriodUnitEnum.MONTH, startDate);
      default:
        return getIntervalDates(duration ?? 1, true, PeriodUnitEnum.DAY, startDate);
    }
  }
}
