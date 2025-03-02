import { OSupportTicket, SupportTicket } from './transaction.model';
import { OSubscription, ISubscription } from './subscription.model';
import { Person } from 'domain/interface/person.model';

export class Client extends Person {
  NIF?: string;
  password: string;
  deviceToken?: string;
  city?: string;
  labelName?: string;
  // relation
  subscriptions?: ISubscription[];
  supports?: SupportTicket[];
  // View model
  isExpiring?: boolean;
}

export interface OClient extends Partial<Omit<Client, 'subscriptions' | 'supports'>> {
  id: string;
  subscriptions?: OSubscription[];
  supports?: OSupportTicket[];
  nbrSubscription?: number;
  nbrSupport?: number;
}

export interface SignedClient extends OClient {
  accessToken: string;
}
