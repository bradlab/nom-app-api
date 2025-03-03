import { ITimestamp } from 'domain/interface';
import { Client, OClient } from './client.model';
import { OStaff, Staff } from './staff.model';

export enum SupportTypeEnum {
  REQUEST = 'REQUEST',
  COMPLAINT = 'COMPLAINT',
}

export enum SupportStatusEnum {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  EVALUATED = 'EVALUATED',
  ARCHIVED = 'ARCHIVED',
}

export class SupportTicket extends ITimestamp {
  id: string;
  clientID?: string;
  message: string;
  type: SupportTypeEnum;
  status: SupportStatusEnum;
  client: Client;
  agent?: Staff;
}

export interface OSupportTicket
  extends Partial<Omit<SupportTicket, 'client' | 'agent'>> {
  client: OClient;
  agent?: OStaff;
}
