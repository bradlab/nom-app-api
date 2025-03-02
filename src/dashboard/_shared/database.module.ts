import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffEntity } from './schema/staff.entity';
import { DashboardRepository, IDashboardRepository } from './dashboard.repository';
import { PrestationEntity } from './schema/prestation.entity';
import { TransactionEntity } from './schema/transaction.entity';
import { SubscriptionEntity } from './schema/subscription.entity';
import { ClientEntity } from './schema/client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StaffEntity,
      PrestationEntity,
      TransactionEntity,
      SubscriptionEntity,
      ClientEntity
    ]),
  ],
  providers: [
    {
      provide: IDashboardRepository,
      useClass: DashboardRepository,
    },
  ],
  exports: [IDashboardRepository],
})
export class DashboardRepositoryModule {}
