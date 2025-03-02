import { Module } from '@nestjs/common';
import { StaffModule } from './manager';
import { ClientModule } from './client';
import { SubscriptionModule } from './subscription';

@Module({
  imports: [StaffModule, ClientModule, SubscriptionModule],
  exports: [StaffModule],
})
export class DashboardModule {}
