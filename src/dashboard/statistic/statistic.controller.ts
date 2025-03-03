import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { DocGlobalStatDTO } from './doc.statistic.dto';
import { StaffGuard } from '../_shared/guard/auth.guard';
import { IStatisticService } from './statistic.service.interface';
import { GlobalStatQuery } from './statistic.input.dto';
import { Roles } from 'adapter/decorator';
import { RoleEnum } from 'app/enum';

@ApiTags('Statistic endpoints')
@ApiBearerAuth()
@UseGuards(StaffGuard)
@Controller('statistics')
export class StatisticController {
  constructor(private readonly statisticService: IStatisticService) {}

  @Roles([RoleEnum.MANAGEMENT])
  @Get()
  @ApiOperation({ summary: "Global stat" })
  @ApiResponse({
    isArray: true,
    type: DocGlobalStatDTO,
  })
  async getAll(@Query() param: GlobalStatQuery) {
    return await this.statisticService.fetchAll(param);
  }
}
