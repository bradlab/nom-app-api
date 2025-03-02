import { ITimestamp } from 'domain/interface';
import { Client, OClient } from './client.model';
import { ISubscription, OSubscription, SubscriptionTypeEnum } from './subscription.model';

export enum TicketType {
  REQUEST = 'Request',
  COMPLAINT = 'Complaint',
}

export enum TicketStatus {
  PENDING = 'Pending',
  ASSIGNED = 'Assigned',
  PROCESSING = 'Processing',
  COMPLETED = 'Completed',
  EVALUATED = 'Evaluated',
  ARCHIVED = 'Archived',
}

export class SupportTicket extends ITimestamp {
  id: string;
  clientID?: string; // ID du client associé à la transaction, utilisé dans les DTO
  amount: number;
  description?: string;
  type: SubscriptionTypeEnum;
  client: Client;
  subscription?: ISubscription;
  isActivated?: boolean;
}

export interface OSupportTicket
  extends Partial<Omit<SupportTicket, 'client' | 'subscription'>> {
  client: OClient;
  subscription?: OSubscription;
}
