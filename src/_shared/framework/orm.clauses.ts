/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { DeepQueryType, PartialDeep } from 'domain/types';
import {
  In,
  Like,
  ILike,
  Between,
  IsNull,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Equal,
  LessThan,
  LessThanOrEqual,
  ArrayContains,
  Raw,
  ObjectLiteral,
} from 'typeorm';

export const VIn = <T>(args: T[]): T => <T>(<unknown>In(args));
export const VLike = <T>(v: string): T => <T>(<unknown>Like(`%${v}%`));
export const VILike = <T>(v: string): T => <T>(<unknown>ILike(`%${v}%`));
export const VBetween = <T>(a: T, b: T): T => <T>(<unknown>Between(a, b));
export const VIsNull = (): void => <void>(<unknown>IsNull());
export const VLessThan = <T>(v: T | DeepQueryType<T>) => {
  return <DeepQueryType<T>>(<unknown>LessThan(v));
};

export const VMoreThan = <T>(v: T | DeepQueryType<T>) => {
  return <DeepQueryType<T>>(<unknown>MoreThan(v));
};

export const VEqual = <T>(v: T | DeepQueryType<T>) => {
  return <DeepQueryType<T>>(<unknown>Equal(v));
};

export const VNot = <T>(v: T | DeepQueryType<T>) => {
  return <DeepQueryType<T>>(<unknown>Not(v));
};

export const VMoreThanOrEqual = <T>(v: T | DeepQueryType<T>) => {
  return <DeepQueryType<T>>(<unknown>MoreThanOrEqual(v));
};
export const VLessThanOrEqual = <T>(v: T | DeepQueryType<T>) => {
  return <DeepQueryType<T>>(<unknown>LessThanOrEqual(v));
};

export const VArrayContains = <T>(v: T[] | PartialDeep<T[]>) => {
  return <DeepQueryType<unknown>>(<unknown>ArrayContains(v));
};

export const VRaw = (
  sql: (alias: string) => string,
  param: ObjectLiteral,
): DeepQueryType<any> => {
  return Raw(sql, param);
};
