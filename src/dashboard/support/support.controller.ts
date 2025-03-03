import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
  UploadedFiles,
  ParseArrayPipe,
  UnauthorizedException,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { GetUser } from '../_shared/decorator';
import { Staff } from '../_shared/model/staff.model';
import { DocSupportDTO } from './doc.support.dto';
import { StaffGuard } from '../_shared/guard/auth.guard';
import { IDParamDTO, IDsParamDTO } from 'adapter/param.dto';
import { SupportFactory } from 'dashboard/_shared/factory/support.factory';
import { OSupportTicket, SupportStatusEnum } from 'dashboard/_shared/model/support.model';
import { ISupportService } from './support.service.interface';
import { ChangeSupportStatusDTO, CreateSupportDTO, SupportQueryDTO, UpdateSupportDTO } from './support.input.dto';
import { Roles } from 'adapter/decorator';
import { RoleEnum } from 'app/enum';
import { DataHelper } from 'adapter/helper/data.helper';

@ApiTags('Support tickets management')
@ApiBearerAuth()
@UseGuards(StaffGuard)
@Controller('support.tickets')
export class SupportController {
  constructor(private readonly supportService: ISupportService) {}

  @Post()
  @ApiOperation({ summary: 'Create new support ticket' })
  @ApiResponse({
    status: 200,
    description: 'La requête a été créée avec succès',
    type: DocSupportDTO,
  })
  async create(
    @GetUser() client: Staff,
    @Body() data: CreateSupportDTO,
  ) {
    return SupportFactory.getSupport(
      await this.supportService.add(client, data),
    );
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Add a list of tickets' })
  @ApiBody({ type: CreateSupportDTO, isArray: true })
  @ApiResponse({
    status: 200,
    description: 'Liste de tickets a été créée avec succès',
    type: DocSupportDTO,
  })
  async bulk(
    @GetUser() client: Staff,
    @Body(new ParseArrayPipe({items: CreateSupportDTO})) datas: CreateSupportDTO[],
  ) {
    const supports = await this.supportService.bulk(client, datas);
    return supports?.map((support) => SupportFactory.getSupport(support));
  }

  @Get()
  @ApiOperation({ summary: "Fetch a list of client tickets" })
  @ApiResponse({
    isArray: true,
    type: DocSupportDTO,
  })
  async getAll(@Query() param: SupportQueryDTO) {
    const supports = await this.supportService.fetchAll(param);
    return supports?.map((support) => SupportFactory.getSupport(support));
  }

  @ApiOperation({ summary: 'Show ticket by ID' })
  @Get(':id')
  async show(@Param() {id}: IDParamDTO) {
    return SupportFactory.getSupport(await this.supportService.fetchOne(id));
  }

  @ApiOperation({ summary: 'Update ticket' })
  @ApiResponse({
    status: 200,
    description: "Le ticket a été mise à jour avec succès",
    type: DocSupportDTO,
  })
  @Patch()
  async update(
    @GetUser() user: Staff,
    @Body() data: UpdateSupportDTO,
  ): Promise<OSupportTicket> {
    return SupportFactory.getSupport(await this.supportService.edit(data));
  }

  
  @Roles([RoleEnum.MANAGEMENT, RoleEnum.SUPPORT, RoleEnum.SUPPORT_MANAGER])
  @Patch('state')
  @ApiOperation({ summary: "Change tickets state", description: "Changer l'état de la requête du client.\n Il permet aussi d'assigner le ticket à un agent." })
  @ApiBody({
    type: ChangeSupportStatusDTO,
    description: 'Id des tickets concernés',
  })
  @ApiResponse({ type: Boolean })
  async setState(@GetUser() user: Staff, @Body() data: ChangeSupportStatusDTO): Promise<boolean> {
    if (!DataHelper.isEmpty(data)) {
      if (data.status === SupportStatusEnum.ASSIGNED && ![RoleEnum.MANAGEMENT, RoleEnum.SUPPORT_MANAGER].includes(user.role)) {
        throw new UnauthorizedException();
      }
      return await this.supportService.setState(data);
    }
    return false;
  }

  @ApiOperation({ summary: 'Remove tickets' })
  @ApiResponse({ type: Boolean })
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT) // Répond avec le statut 204 (No Content) si la suppression réussit
  async remove(@Param() { ids }: IDsParamDTO) {
    return this.supportService.remove(ids!);
  }
}
