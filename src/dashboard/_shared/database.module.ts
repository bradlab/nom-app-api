import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffEntity } from './schema/staff.entity';
import { DashboardRepository, IDashboardRepository } from './dashboard.repository';
import { SupportEntity } from './schema/support.entity';
import { SubscriptionEntity } from './schema/subscription.entity';
import { ClientEntity } from './schema/client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StaffEntity,
      SupportEntity,
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
