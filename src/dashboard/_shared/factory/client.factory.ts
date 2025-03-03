import { SubscriptionFactory } from './subscription.factory';
import { Client, OClient } from '../model/client.model';
import { ICreateClientDTO, IUpdateClientDTO } from 'dashboard/client/client.service.interface';
import { SupportFactory } from './support.factory';
import { DataHelper } from 'adapter/helper/data.helper';
import { HashFactory } from 'adapter/hash.factory';

export abstract class ClientFactory {
  static async create(data: ICreateClientDTO): Promise<Client> {
    const client = new Client();
    client.email = data.email;
    client.phone = data.phone;
    client.firstname = data.firstname;
    client.address = data.address;
    client.NIF = data.NIF;
    client.lastname = data.lastname;
    client.country = data.country;
    client.city = data.city;
    client.sex = data.sex;
    client.labelName = data.labelName;
    client.password = await HashFactory.hashPwd(data.password!);
    return client;
  }

  static update(client: Client, data: IUpdateClientDTO): Client {
    client.firstname = data.firstname ?? client.firstname;
    client.lastname = data.lastname ?? client.lastname;
    client.address = data.address ?? client.address;
    client.country = data.country ?? client.country;
    client.city = data.city ?? client.city;
    client.NIF = data.NIF ?? client.NIF;
    client.email = data.email ?? client.email;
    client.phone = data.phone ?? client.phone;
    client.sex = data.sex ?? client.sex;
    client.labelName = data.labelName ?? client.labelName;
    if (client.NIF) {
      client.isBusiness = true;
    }

    return client;
  }

  static getClient(client: Client, deep: boolean = true): OClient {
    if (client) {
      return {
        id: client.id,
        email: client.email,
        phone: client.phone,
        firstname: client.firstname,
        address: client.address,
        country: client.country,
        city: client.city,
        sex: client.sex,
        labelName: client.labelName ?? DataHelper.getFullName(client.firstname, client.lastname),
        subscriptions: deep ? SubscriptionFactory.getSubscriptions(client.subscriptions!) : [],
        supports: deep ? SupportFactory.getSupports(client.supports!) : [],
        isActivated: client.isActivated,
        nbrSubscription: client.subscriptions?.length,
        nbrSupport: client.supports?.length,
        isExpiring: client.isExpiring,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
      };
    }
    return null as unknown as OClient;
  }
}
