import { ITimestamp } from 'domain/interface';
import { Client, OClient } from './client.model';

export enum SubscriptionTypeEnum {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUAL = 'ANNUAL',
  PACKAGE = 'PACKAGE',
}

export class ISubscription extends ITimestamp {
  id: string;
  type: SubscriptionTypeEnum;
  value?: number; // en Mega octets (uniquement pour les forfaits)
  duration?: number; // Durée en jours
  startDate: Date;
  endDate: Date;
  price: number;
  client: Client;
  isActivated: boolean;
}

export interface OSubscription extends Partial<Omit<ISubscription, 'client'>> {
  client?: OClient;
}
