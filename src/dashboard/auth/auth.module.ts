import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JWT_CONSTANCE } from 'domain/constant/constants';
import { DashboardRepositoryModule } from '../_shared/database.module';
import { IAuthService } from './auth.service.interface';

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_CONSTANCE.STAFF_SECRET,
      signOptions: { expiresIn: '1 days' },
      verifyOptions: { ignoreExpiration: true },
    }),
    DashboardRepositoryModule,
  ],
  controllers: [AuthController],
  providers: [{ provide: IAuthService, useClass: AuthService }],
  exports: [IAuthService, JwtModule, DashboardRepositoryModule],
})
export class AuthModule {}
