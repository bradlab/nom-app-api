import { forwardRef, Module } from '@nestjs/common';

import { SupportService } from './support.service';
import { ISupportService } from './support.service.interface';
import { StaffModule } from 'dashboard/manager';
import { SupportController } from './support.controller';

@Module({
  imports: [forwardRef(() => StaffModule)],
  controllers: [SupportController],
  providers: [{ provide: ISupportService, useClass: SupportService }],
  exports: [ISupportService],
})
export class SupportModule {}
