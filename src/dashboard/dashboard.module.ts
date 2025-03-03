import { Module } from '@nestjs/common';
import { StaffModule } from './manager';
import { ClientModule } from './client';
import { SubscriptionModule } from './subscription';
import { SupportModule } from './support';

@Module({
  imports: [StaffModule, ClientModule, SubscriptionModule, SupportModule],
  exports: [],
})
export class DashboardModule {}
