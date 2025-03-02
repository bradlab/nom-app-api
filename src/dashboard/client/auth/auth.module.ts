import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientAuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JWT_CONSTANCE } from 'domain/constant/constants';
import { IClientAuthService } from './auth.service.interface';
import { DashboardRepositoryModule } from 'dashboard/_shared/database.module';

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_CONSTANCE.CLIENT_SECRET,
      signOptions: { expiresIn: '1 days' },
      verifyOptions: { ignoreExpiration: true },
    }),
    DashboardRepositoryModule,
  ],
  controllers: [AuthController],
  providers: [{ provide: IClientAuthService, useClass: ClientAuthService }],
  exports: [IClientAuthService, JwtModule, DashboardRepositoryModule],
})
export class ClientAuthModule {}
