import { createParamDecorator, UnauthorizedException } from '@nestjs/common';
import { DataHelper } from 'adapter/helper/data.helper';

import { Staff } from '../model/staff.model';

export const GetUser = createParamDecorator((_data, context): Staff => {
  const req = context.getArgs()[0];
  if (!DataHelper.isEmpty(req?.user)) return req.user;

  throw new UnauthorizedException();
});
