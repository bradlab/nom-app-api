import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { DataHelper } from 'adapter/helper/data.helper';
import { Request } from 'express';

import { JWT_CONSTANCE } from 'domain/constant/constants';
import { IJwtPayload } from 'domain/interface';
import { Staff } from '../model/staff.model';
import { IAuthService } from '../../auth/auth.service.interface';
import { Roles } from 'adapter/decorator';

export const _extractTokenFromHeader = (
  request: Request,
): string | undefined => {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};

@Injectable()
export class StaffGuard implements CanActivate {
  private readonly logger = new Logger();

  constructor(
    private authService: IAuthService,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    // habituellement true, si la requête vient d'un serveur backend pour permettre des requêtes de seed
    if (isPublic) {
      return true;
    }
    const roles = this.reflector.get(Roles, context.getHandler());
    
    try {
      const token = _extractTokenFromHeader(request);
      if (token) {
        const payload: IJwtPayload = await this._getPayload(token);
        const user = await this._validate(payload);
        request['user'] = user;
        if (!user) {
          throw new UnauthorizedException();
        }
        if (roles) {
          return roles.includes(user.role);
        }
        return true;
      }
      throw new UnauthorizedException();
    } catch (error) {
      if (error.status === 401) {
        throw error;
      }
      return false;
    }
  }

  private async _getPayload(token: string): Promise<IJwtPayload> {
    return await this.jwtService.verifyAsync(token, {
      secret: JWT_CONSTANCE.STAFF_SECRET,
      ignoreExpiration: true,
    });
  }

  private async _validate(payload: IJwtPayload): Promise<Staff | undefined> {
    let account: Staff;
    if (!DataHelper.isEmpty(payload)) {
      account = await this.authService.search({
        ...payload,
        isActivated: true,
      });
      return account;
    }
  }
}
