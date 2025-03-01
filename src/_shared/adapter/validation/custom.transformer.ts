import { Transform } from 'class-transformer';

export const ParseBoolean = (): PropertyDecorator =>
  Transform(({ value }) => {
    return value === 'true';
  });
