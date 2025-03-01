import { Module } from '@nestjs/common';

import { StaffService } from './staff.service';
import { StaffController } from './stafff.controller';
import { AuthModule } from '../auth';
import { IStaffService } from './staff.service.interface';
import { StaffGuard } from '../_shared/guard/auth.guard';

@Module({
  imports: [AuthModule],
  controllers: [StaffController],
  providers: [
    StaffGuard,
    { provide: IStaffService, useClass: StaffService },
  ],
  exports: [IStaffService, AuthModule],
})
export class StaffModule {}
