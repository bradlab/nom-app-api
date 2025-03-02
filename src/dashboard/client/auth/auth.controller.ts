import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { IClientAuthService, IRegisterClienttDTO } from './auth.service.interface';
import {
  ForgotPasswordDTO,
  SigninAccoutDTO,
  UpdatePwdDTO,
} from 'adapter/auth.dto';
import { BaseConfig } from 'config/base.config';
import { GetClient, Public } from 'adapter/decorator';
import { ClientFactory } from 'dashboard/_shared/factory/client.factory';
import { Client, OClient, SignedClient } from 'dashboard/_shared/model/client.model';
import { ClientGuard } from './guard/auth.guard';
import { DocClientDTO, DocSignedClientDTO } from '../doc.client.dto';
import { RegisterClientDTO } from './auth.input.dto';

@ApiTags('Client as customer Authentication')
@Controller('client.auth')
export class AuthController {
  constructor(private readonly authService: IClientAuthService) {}

  @Public()
  @Get('check.email/:email')
  @ApiOperation({
    summary: 'Check email',
    description:
      'This endpoint allows to check if the email exist before register it',
  })
  @ApiParam({ type: String, name: 'email' })
  @ApiResponse({ type: Boolean })
  checkEmail(@Param('email') email: string): Promise<boolean> {
    return this.authService.checkEmail(email);
  }

  @Public()
  @Get('check.phone/:phone')
  @ApiOperation({
    summary: 'Check phone',
    description:
      'This endpoint allows to check if the phone exist before register it',
  })
  @ApiParam({ type: String, name: 'phone' })
  @ApiResponse({ type: Boolean })
  checkPhone(@Param('phone') phone: string): Promise<boolean> {
    return this.authService.checkPhone(phone);
  }

  @ApiBearerAuth()
  @UseGuards(ClientGuard)
  @Get('token.signin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Token connexion' })
  @ApiResponse({ type: DocSignedClientDTO })
  async signinByToken(@GetClient() user: Client): Promise<OClient> {
    return ClientFactory.getClient(user);
  }

  /**
   * @method POST
   */

  @Public()
  @Post('signup')
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({
    summary: 'Register client or customer account',
    description: 'Créé un compte client dans le système',
  })
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: BaseConfig.setFilePath,
        filename: BaseConfig.editFileName,
      }),
      fileFilter: BaseConfig.imageFileFilter,
    }),
  )
  @ApiResponse({ type: DocClientDTO })
  async create(
    @Body() data: RegisterClientDTO,
    @UploadedFile() file: any,
  ): Promise<OClient> {
    data.logo = file?.filename;
    const client = await this.authService.signup(data as IRegisterClienttDTO);
    return ClientFactory.getClient(client);
  }

  @Post('signin')
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({ summary: 'User connexion endpoint' })
  @ApiBody({ type: SigninAccoutDTO })
  @ApiResponse({ type: DocSignedClientDTO })
  async signin(@Body() data: SigninAccoutDTO): Promise<SignedClient> {
    const { accessToken, user } = await this.authService.signin(data);
    if (user) {
      return {
        accessToken,
        ...ClientFactory.getClient(user),
      };
    }
    throw new UnauthorizedException('User not found');
  }

  @Post('password.forgot')
  @ApiOperation({
    summary: 'Forgot password',
    description:
      "Ce endpoint permet à un utilisateur de notifier à un admin qu'il a oublié son mot de passe",
  })
  @ApiBody({ type: ForgotPasswordDTO })
  @ApiResponse({ type: String })
  async forgotPassword(@Body() data: ForgotPasswordDTO): Promise<boolean> {
    return await this.authService.forgotPassword(data);
  }

  @Patch('password.update')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update password',
    description: 'Modifier le mot de passe client',
  })
  @ApiBody({ type: UpdatePwdDTO })
  @ApiResponse({ type: Boolean })
  async updatePassword(
    @GetClient() client: Client,
    @Body() data: UpdatePwdDTO,
  ): Promise<boolean> {
    return await this.authService.updatePassword(client, data);
  }
}
