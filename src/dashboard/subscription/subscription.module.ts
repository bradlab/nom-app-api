import { forwardRef, Module } from '@nestjs/common';

import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { ISubscriptionService } from './subscription.service.interface';
import { StaffModule } from 'dashboard/manager';
import { TaskModule } from 'task/task.module';

@Module({
  imports: [StaffModule, TaskModule],
  controllers: [SubscriptionController],
  providers: [{ provide: ISubscriptionService, useClass: SubscriptionService }],
  exports: [ISubscriptionService],
})
export class SubscriptionModule {}
