import { ITimestamp } from 'domain/interface';
import { OPrestation } from './prestation.model';
import { Client, OClient } from './client.model';
import { ISubscription, OSubscription } from './subscription.model';

export enum SubscriptionTypeEnum {
  SUBSCRIPTION = 'SUBSCRIPTION',
  FORFAIT = 'FORFAIT',
}

export class Transaction extends ITimestamp {
  id: string;
  clientID?: string; // ID du client associé à la transaction, utilisé dans les DTO
  amount: number;
  description?: string;
  type: SubscriptionTypeEnum;
  client: Client;
  subscription?: ISubscription;
  isActivated?: boolean;
}

export interface OTransaction
  extends Partial<Omit<Transaction, 'client' | 'subscription'>> {
  client: OClient;
  subscription?: OSubscription;
  prestation?: OPrestation;
}
