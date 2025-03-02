import { Module } from '@nestjs/common';
import { GlobalSeed } from './global.seed';
import { StaffModule } from 'dashboard/manager';

@Module({
  imports: [StaffModule],
  providers: [GlobalSeed],
})
export class SeedsModule {}
