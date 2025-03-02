import { ITimestamp } from 'domain/interface';
import { OPrestation, Prestation } from './prestation.model';
import { Client, OClient } from './client.model';
import { Transaction, SubscriptionTypeEnum } from './transaction.model';
import { PeriodUnitEnum } from 'app/enum';

export class ISubscription extends ITimestamp {
  id: string;
  isActivated: boolean;
  type: SubscriptionTypeEnum;
  client?: Client;
  period?: number;
  periodUnit?: PeriodUnitEnum;
  prestation?: Prestation;
  startAt: Date;
  dueDate?: Date;
  closedAt?: Date;
  transactions?: Transaction[];
}

export interface OSubscription extends Partial<Omit<ISubscription, 'client' | 'prestation'>> {
  client?: OClient;
  prestation?: OPrestation;
}

export interface DataSubItem {
  createdAt: string;
  updatedAt: string;
  deletedAt: any | null; // Utiliser 'any' si le type précis de 'deletedAt' est inconnu, ou un type plus spécifique si possible
  id: string;
  isActivated: boolean;
  type: string;
  startAt: string;
  dueDate: string;
  closedAt: any | null;
  client: {}; // Remplacer par un type plus spécifique si 'client' a une structure définie
  prestation: {}; // Remplacer par un type plus spécifique si 'prestation' a une structure définie
}
