import { Module } from '@nestjs/common';
import { StaffModule } from './manager';
import { ClientModule } from './client';

@Module({
  imports: [StaffModule, ClientModule],
  exports: [StaffModule],
})
export class DashboardModule {}
