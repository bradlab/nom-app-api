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
  support?: SupportTicket[];
  // View model
  isExpiring?: boolean;
}

export interface OClient extends Partial<Omit<Client, 'subscriptions' | 'histories'>> {
  id: string;
  subscriptions?: OSubscription[];
  histories?: OSupportTicket[];
  nbrSubscription?: number;
  nbrTransaction?: number;
}

export interface SignedClient extends OClient {
  accessToken: string;
}
