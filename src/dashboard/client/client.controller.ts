import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  ParseArrayPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiQuery,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { IDParamDTO, IDsParamDTO } from 'adapter/param.dto';
import { IClientService } from './client.service.interface';
import {
  ClientQuerDTO,
  UpdateClientDTO,
} from './client.input.dto';
import { Staff, OStaff } from '../_shared/model/staff.model';
import { DocClientDTO } from './doc.client.dto';
import { GetUser } from '../_shared/decorator';
import { StaffGuard } from '../_shared/guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { BaseConfig } from 'config/base.config';
import { OClient } from 'dashboard/_shared/model/client.model';
import { ClientFactory } from 'dashboard/_shared/factory/client.factory';
import { RegisterClientDTO } from './auth/auth.input.dto';

@ApiTags('Client or customer management')
@UseGuards(StaffGuard)
@ApiBearerAuth()
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: IClientService) {}

  @Get()
  @ApiOperation({
    summary: 'Clients list',
    description: 'Fetch all clients in the DB',
  })
  @ApiResponse({ type: DocClientDTO, isArray: true })
  async all(@Query() param: ClientQuerDTO): Promise<OStaff[]> {
    if (param && typeof param.ids === 'string') {
      const ids: string = param.ids;
      param.ids = ids?.split(',');
    }
    const clients = await this.clientService.fetchAll(param);
    return clients.map((client) => ClientFactory.getClient(client, false));
  }

  @Get('search')
  @ApiOperation({
    summary: 'Single account',
    description: 'Fetch the client account by some of its informations',
  })
  @ApiQuery({
    type: String,
    name: 'email',
    description: 'email of the auth client',
    required: false,
  })
  @ApiQuery({
    type: String,
    name: 'phone',
    description: 'phone number of the auth client',
    required: false,
  })
  @ApiResponse({ type: DocClientDTO })
  async search(@Query() param: ClientQuerDTO): Promise<OStaff | undefined> {
    if (param) {
      return ClientFactory.getClient(
        await this.clientService.search(param, undefined),
      );
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'One Client',
    description: 'Fetch client account by ID',
  })
  @ApiParam({
    type: String,
    name: 'id',
    description: 'ID of the needed clinic',
  })
  @ApiResponse({ type: DocClientDTO })
  async show(@Param() { id }: IDParamDTO): Promise<OStaff> {
    return ClientFactory.getClient(await this.clientService.fetchOne(id));
  }

  /**
   * @method POST
   */

  @Post()
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({
    summary: 'Create account client',
    description:
      'Créé un client B2B',
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: BaseConfig.setFilePath,
        filename: BaseConfig.editFileName,
      }),
      fileFilter: BaseConfig.imageFileFilter,
    }),
  )
  async create(
    @Body() data: RegisterClientDTO,
    @UploadedFile() file: any,
  ): Promise<OStaff> {
    data.logo = file ? file.filename : undefined;
    const client = await this.clientService.add(data);
    return ClientFactory.getClient(client);
  }

    @Post('bulk')
    @ApiOperation({ summary: 'Create a list of clients' })
    @ApiBody({type: RegisterClientDTO, isArray: true})
    @ApiResponse({
      status: 200,
      description: "clients créés avec succès",
      type: DocClientDTO,
    })
    async bulk(
      @GetUser() user: Staff,
      @Body(new ParseArrayPipe({ items: RegisterClientDTO })) datas: RegisterClientDTO[],
    ) {
      const clients = await this.clientService.bulk(user, datas);
      return clients?.map((prestation) => ClientFactory.getClient(prestation));
    }

  /**
   * @method PATCH
   */

  @Patch()
  @ApiOperation({ summary: 'Update client account' })
  @ApiBody({ type: UpdateClientDTO })
  @ApiResponse({ type: DocClientDTO })
  async update(@Body() data: UpdateClientDTO): Promise<OClient> {
    return ClientFactory.getClient(await this.clientService.edit(data));
  }

  @Patch('state')
  @ApiOperation({ summary: "Change agent state", description: 'Activer ou désactiver un agent' })
  @ApiBody({
    type: IDsParamDTO,
    description: 'Id des utilisateurs concernés',
  })
  @ApiResponse({ type: Boolean })
  async setState(@Body() { ids }: IDsParamDTO): Promise<boolean> {
    if (ids) {
      if (ids && typeof ids === 'string') ids = [ids];
      return await this.clientService.setState(ids);
    }
    return false;
  }

  /**
   * @method DELETE
   */

  @ApiExcludeEndpoint()
  @Delete('clean')
  @ApiOperation({ summary: 'Clean removed Accounts' })
  @ApiResponse({ type: Boolean })
  clean(): Promise<boolean> {
    return this.clientService.clean();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove Account' })
  @ApiParam({
    type: String,
    name: 'id',
    description: 'ID of the client to remove',
  })
  @ApiResponse({ type: Boolean })
  remove(@Param() { id }: IDParamDTO): Promise<boolean> {
    return this.clientService.remove(id);
  }
}
