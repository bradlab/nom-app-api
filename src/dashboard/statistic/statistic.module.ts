import { forwardRef, Module } from '@nestjs/common';

import { StatisticService } from './statistic.service';
import { IStatisticService } from './statistic.service.interface';
import { StaffModule } from 'dashboard/manager';
import { StatisticController } from './statistic.controller';

@Module({
  imports: [forwardRef(() => StaffModule)],
  controllers: [StatisticController],
  providers: [{ provide: IStatisticService, useClass: StatisticService }],
  exports: [IStatisticService],
})
export class StatisticModule {}
