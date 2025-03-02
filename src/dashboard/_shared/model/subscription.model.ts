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
