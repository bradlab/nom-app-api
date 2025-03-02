import { OTransaction, Transaction } from './transaction.model';
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
  histories?: Transaction[];
}

export interface OClient extends Partial<Omit<Client, 'subscriptions' | 'histories'>> {
  id: string;
  subscriptions?: OSubscription[];
  histories?: OTransaction[];
  nbrSubscription?: number;
  nbrTransaction?: number;
}

export interface SignedClient extends OClient {
  accessToken: string;
}
