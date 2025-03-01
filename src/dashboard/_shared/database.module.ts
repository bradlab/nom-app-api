import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffEntity } from './schema/staff.entity';
import { DashboardRepository, IDashboardRepository } from './dashboard.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StaffEntity,
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
