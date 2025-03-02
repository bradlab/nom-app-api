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
import { DataGenerator } from 'domain/generator/data.generator';
import { IDParamDTO, IDsParamDTO } from 'adapter/param.dto';
import { IStaffService } from './staff.service.interface';
import {
  UserQuerDTO,
  UpdateUserDTO,
} from './staff.input.dto';
import { OStaff } from '../_shared/model/staff.model';
import { StaffFactory } from '../_shared/factory/staff.factory';
import { DocStaffDTO } from './doc.staff.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BaseConfig } from 'config/base.config';
import { StaffGuard } from 'dashboard/_shared/guard/auth.guard';
import { RegisterStaffDTO } from 'dashboard/auth/auth.input.dto';
import { Roles } from 'adapter/decorator';
import { RoleEnum } from 'app/enum';

@ApiTags('User as Agent as Staff management')
@UseGuards(StaffGuard)
@ApiBearerAuth()
@Controller('users')
export class StaffController {
  constructor(private readonly staffService: IStaffService) {}

  @Roles([RoleEnum.MANAGEMENT, RoleEnum.SUPPORT_MANAGER])
  @Get()
  @ApiOperation({
    summary: 'list of agent',
    description: 'Afficher la liste des agents de Nom App',
  })
  @ApiResponse({ type: DocStaffDTO, isArray: true })
  async all(@Query() param: UserQuerDTO): Promise<OStaff[]> {
    if (param && typeof param.ids === 'string') {
      const ids: string = param.ids;
      param.ids = ids?.split(',');
    }
    const users = await this.staffService.fetchAll(param);
    return users.map((user) => StaffFactory.getUser(user));
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Show Agent',
    description: 'Fetch staff account by ID',
  })
  @ApiParam({
    type: String,
    name: 'id',
    description: 'ID of the needed clinic',
  })
  @ApiResponse({ type: DocStaffDTO })
  async show(@Param() { id }: IDParamDTO): Promise<OStaff> {
    console.log('ID ===== ', id);
    return StaffFactory.getUser(await this.staffService.fetchOne(id));
  }

  /**
   * @method POST
   */

  @Roles([RoleEnum.MANAGEMENT])
  @Post()
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({
    summary: 'Create account staff',
    description: 'Ajouter des agents dans le système',
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
    @Body() data: RegisterStaffDTO,
    @UploadedFile() file: any,
  ): Promise<OStaff | undefined> {
    console.log('data', data);
    data.avatar = file ? file.filename : undefined;
    return await this.staffService.add(data);
  }

  /**
   * @method PATCH
   */


  @Patch()
  @ApiOperation({ summary: 'Update staff account' })
  @ApiBody({ type: UpdateUserDTO })
  @ApiResponse({ type: DocStaffDTO })
  async update(@Body() data: UpdateUserDTO): Promise<OStaff> {
    return StaffFactory.getUser(await this.staffService.edit(data));
  }

  @Roles([RoleEnum.MANAGEMENT])
  @Patch('state')
  @ApiOperation({ summary: "Change staff agent account state" })
  @ApiBody({
    type: IDsParamDTO,
    description: 'Id des utilisateurs concernés',
  })
  @ApiResponse({ type: Boolean })
  async setState(@Body() { ids }: IDsParamDTO): Promise<boolean> {
    if (ids) {
      if (ids && typeof ids === 'string') ids = [ids];
      return await this.staffService.setState(ids);
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
    return this.staffService.clean();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove Account' })
  @ApiParam({
    type: String,
    name: 'id',
    description: 'ID of the user to remove',
  })
  @ApiResponse({ type: Boolean })
  remove(@Param() { id }: IDParamDTO): Promise<boolean> {
    return this.staffService.remove(id);
  }
}
