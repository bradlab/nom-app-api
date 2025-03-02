import { forwardRef, Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { SubscriptionModule } from 'dashboard/subscription';
import { ITaskService } from './task.service.interface';

@Module({
  imports: [
    forwardRef(() => SubscriptionModule),
  ],
  providers: [
    {
      provide: ITaskService,
      useClass: TaskService,
    },
  ],
  exports: [ITaskService],
})
export class TaskModule {}
