/* eslint-disable @typescript-eslint/no-unused-vars */
import { ISubscription, OSubscription } from '../model/subscription.model';
import { DataHelper } from 'adapter/helper/data.helper';
import { ClientFactory } from './client.factory';
import { PrestationFactory } from './prestation.factory';

export abstract class SubscriptionFactory {
  static getSubscription(subscription: ISubscription): OSubscription {
    if (subscription) {
      return {
        id: subscription.id,
        type: subscription.type,
        startAt: subscription.startAt,
        dueDate: subscription.dueDate,
        closedAt: subscription.closedAt,
        isActivated: subscription.isActivated,
        prestation: PrestationFactory.getPrestation(subscription.prestation!),
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
}
