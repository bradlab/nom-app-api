import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DBGenericRepository } from 'framework/database.repository';
import { Repository } from 'typeorm';
import { StaffEntity } from './schema/staff.entity';
import { Staff } from './model/staff.model';
import { SupportTicket } from './model/support.model';
import { SupportEntity } from './schema/support.entity';
import { IGenericRepository } from '../../_shared/domain/abstract';
import { ISubscription } from './model/subscription.model';
import { SubscriptionEntity } from './schema/subscription.entity';
import { ClientEntity } from './schema/client.entity';
import { Client } from './model/client.model';

export abstract class IDashboardRepository {
  users: IGenericRepository<Staff>;
  clients: IGenericRepository<Client>;
  supports: IGenericRepository<SupportTicket>;
  subscriptions: IGenericRepository<ISubscription>;
}

@Injectable()
export class DashboardRepository
  implements IDashboardRepository, OnApplicationBootstrap
{
  users: DBGenericRepository<StaffEntity>;
  clients: DBGenericRepository<ClientEntity>;
  supports: DBGenericRepository<SupportEntity>;
  subscriptions: DBGenericRepository<SubscriptionEntity>;

  constructor(
    @InjectRepository(StaffEntity)
    private staffRepository: Repository<StaffEntity>,

    @InjectRepository(ClientEntity)
    private clientRepository: Repository<ClientEntity>,

    @InjectRepository(SupportEntity)
    private supportRepository: Repository<SupportEntity>,

    @InjectRepository(SubscriptionEntity)
    private subscriptionRepository: Repository<SubscriptionEntity>,
  ) {}

  onApplicationBootstrap(): void {
    this.users = new DBGenericRepository<StaffEntity>(this.staffRepository);
    this.clients = new DBGenericRepository<ClientEntity>(this.clientRepository);
    this.supports = new DBGenericRepository<SupportEntity>(
      this.supportRepository,
    );
    this.subscriptions = new DBGenericRepository<SubscriptionEntity>(this.subscriptionRepository);
  }
}
