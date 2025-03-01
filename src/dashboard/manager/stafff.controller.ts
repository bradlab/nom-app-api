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
  RegisterStaffDTO,
  UpdateUserDTO,
  UpdateUsernameDTO,
} from './staff.input.dto';
import { Staff, OStaff } from '../_shared/model/staff.model';
import { StaffFactory } from '../_shared/factory/staff.factory';
import { DocStaffDTO } from './doc.staff.dto';
import { GetUser } from '../_shared/decorator';
import { StaffGuard } from '../_shared/guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { BaseConfig } from 'config/base.config';

@ApiTags('User as Staff management')
@UseGuards(StaffGuard)
@ApiBearerAuth()
@Controller('users')
export class StaffController {
  constructor(private readonly staffService: IStaffService) {}

  @Get()
  @ApiOperation({
    summary: 'users list',
    description: 'Fetch all users in the DB',
  })
  @ApiResponse({ type: DocStaffDTO, isArray: true })
  async all(@Query() param: UserQuerDTO): Promise<OStaff[]> {
    if (param && typeof param.ids === 'string') {
      const ids: string = param.ids;
      param.ids = ids?.split(',');
    }
    console.log('first param', param);
    const users = await this.staffService.fetchAll(param);
    return users.map((user) => StaffFactory.getUser(user));
  }

  @Get('search')
  @ApiOperation({
    summary: 'Single account',
    description: 'Fetch the staff account by some of its informations',
  })
  @ApiQuery({
    type: String,
    name: 'email',
    description: 'email of the auth staff',
    required: false,
  })
  @ApiQuery({
    type: String,
    name: 'phone',
    description: 'phone number of the auth staff',
    required: false,
  })
  @ApiResponse({ type: DocStaffDTO })
  async search(@Query() param: UserQuerDTO): Promise<OStaff | undefined> {
    if (param) {
      return StaffFactory.getUser(
        await this.staffService.search(param, undefined),
      );
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'One staff',
    description: 'Fetch staff account by ID',
  })
  @ApiParam({
    type: String,
    name: 'id',
    description: 'ID of the needed clinic',
  })
  @ApiResponse({ type: DocStaffDTO })
  async show(@Param() { id }: IDParamDTO): Promise<OStaff> {
    return StaffFactory.getUser(await this.staffService.fetchOne(id));
  }

  /**
   * @method POST
   */

  @ApiExcludeEndpoint()
  @Post()
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({
    summary: 'Create account staff',
    description:
      'As a partner of the project, you can create staff as employee for your business',
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
    data.avatar = file ? file.filename : undefined;
    data.password = DataGenerator.randomString();
    const user = await this.staffService.add(data);
    if (user)
      return { ...StaffFactory.getUser(user), password: data.password };
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

  @Patch('state')
  @ApiOperation({ summary: "Modification d'état des utilisateurs" })
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
