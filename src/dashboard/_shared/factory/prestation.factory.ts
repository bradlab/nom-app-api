/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prestation, OPrestation } from '../model/prestation.model';
import { SubscriptionFactory } from './subscription.factory';
import { DataHelper } from 'adapter/helper/data.helper';

export abstract class PrestationFactory {
  static getPrestation(prestation: Prestation, deep: boolean = true): OPrestation {
    if (prestation) {
      return {
        id: prestation.id,
        description: prestation.description,
        name: prestation.name,
        price: prestation.price,
        isActivated: prestation.isActivated,
        images: DataHelper.getFileLinks(prestation.images!),
        subscriptions: deep ? SubscriptionFactory.getSubscriptions(prestation.subscriptions) : [],
        nbrSubscription: prestation.subscriptions?.length,
        createdAt: prestation.createdAt,
        updatedAt: prestation.updatedAt,
      };
    }
    return null as any;
  }
}
