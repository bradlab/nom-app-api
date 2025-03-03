import { Module } from '@nestjs/common';
import { StaffModule } from './manager';
import { ClientModule } from './client';
import { SubscriptionModule } from './subscription';
import { SupportModule } from './support';
import { StatisticModule } from './statistic';

@Module({
  imports: [StaffModule, ClientModule, SubscriptionModule, SupportModule, StatisticModule],
  exports: [],
})
export class DashboardModule {}
