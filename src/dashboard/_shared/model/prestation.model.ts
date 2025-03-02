import { ITimestamp } from 'domain/interface';
import { OStaff } from './staff.model';
import { ISubscription, OSubscription } from './subscription.model';

export class Prestation extends ITimestamp {
  id: string;
  name?: string;
  description?: string;
  price: number;
  isActivated?: boolean;
  images?: string[];
  // relation
  subscriptions: ISubscription[];
}

export interface OPrestation extends Partial<Omit<Prestation, 'subscriptions'>> {
  user?: OStaff;
  subscriptions?: OSubscription[];
  nbrSubscription?: number
}
