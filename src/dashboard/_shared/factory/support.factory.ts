import { DataHelper } from 'adapter/helper/data.helper';
import { OSupportTicket, SupportTicket } from '../model/support.model';
import { ClientFactory } from './client.factory';
import { Staff } from '../model/staff.model';
import { StaffFactory } from './staff.factory';
import { ICreateSupportDTO, IUpdateSupportDTO } from 'dashboard/support/support.service.interface';
import { Client } from '../model/client.model';

export abstract class SupportFactory {

  static create(data: ICreateSupportDTO, client: Client): SupportTicket {
    const support = new SupportTicket();
    support.client = client;
    support.type = data.type;
    support.message = data.message;
    // subscription.isActivated = subscription.endDate > new Date();

    return support;
  }
  static update(data: IUpdateSupportDTO, subscription: SupportTicket): SupportTicket {
    if (subscription) {
      subscription.type = data.type || subscription.type;
      subscription.message = data.message || subscription.message;
      subscription.client = data.client || subscription.client;
    }
    return subscription;
  }

  static getSupport(support: SupportTicket): OSupportTicket {
    if (support) {
      return {
        id: support.id,
        type: support.type,
        message: support.message,
        status: support.status,
        client: ClientFactory.getClient(support.client),
        agent: StaffFactory.getUser(support.agent as Staff),
        createdAt: support.createdAt,
        updatedAt: support.updatedAt,
      };
    }
    return null as any;
  }

  static getSupports(supports: SupportTicket[]): OSupportTicket[] {
    if (DataHelper.isNotEmptyArray(supports)) {
      return supports.map(this.getSupport);
    }
    return [];
  }
}
