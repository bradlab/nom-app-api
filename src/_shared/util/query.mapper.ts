import { DataHelper } from 'adapter/helper/data.helper';
import { DeepQueryType } from 'domain/types';
import { VBetween, VILike, VRaw } from 'framework/orm.clauses';
import { getDates } from './date.helper';

export function searchQuery<T>(data: DeepQueryType<T>): DeepQueryType<T> {
  const queryData = { ...data };
  if (!DataHelper.isEmpty(data)) {
    for (const key in data) {
      const value = data[key];
      if (value) {
        if (value instanceof Date) {
          const { from, to } = getDates(value?.toString());
          queryData[key] = VBetween(from, to);
        } else {
          switch (typeof value) {
            case 'object':
              if (Array.isArray(value)) {
                queryData[key] = VRaw((alias) => `${alias} IN (:...value)`, {
                  value,
                });
              } else {
                queryData[key] = searchQuery(value);
              }
              break;
            case 'string':
              const dateReg =
                /^\d{4}-\d{2}-\d{2}([T\s]\d{2}:\d{2}:\d{2}(.\d{3})?Z)?$/;
              if (dateReg.test(value)) {
                const { from, to } = getDates(value);
                queryData[key] = VBetween(from, to);
              }
              if (key === 'id') queryData[key] = value;
              else {
                queryData[key] = VILike(value);
              }
              break;
            default:
              queryData[key] = value;
              break;
          }
        }
      }
    }
  }
  return queryData;
}
