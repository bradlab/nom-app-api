/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  SetMetadata,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataHelper } from 'adapter/helper/data.helper';
import { RoleEnum } from 'app/enum';
import { User } from 'domain/interface';

export const Public = () => SetMetadata('isPublic', true);

export const Roles = Reflector.createDecorator<RoleEnum[]>();

export const GetClient = createParamDecorator((_, context): User => {
  const req = context.getArgs()[0];
  if (!DataHelper.isEmpty(req?.user)) return req.user;

  throw new UnauthorizedException();
});
