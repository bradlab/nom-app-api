import { Module } from '@nestjs/common';
import { StaffModule } from './manager';

@Module({
  imports: [StaffModule],
  exports: [StaffModule],
})
export class DashboardModule {}
