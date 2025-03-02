import { ISubscription } from 'dashboard/_shared/model/subscription.model';

export abstract class ITaskService {
  abstract addSubscriptionExpiryCron(subscription: ISubscription): void;
}
