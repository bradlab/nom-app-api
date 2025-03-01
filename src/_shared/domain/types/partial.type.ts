/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Make all properties in T optional and with boolean type
 */
export type PartialBool<T> = {
  [A in keyof T]?: boolean;
};

type FindOptionsOrderValue =
  | 'ASC'
  | 'DESC'
  | 'asc'
  | 'desc'
  | 1
  | -1
  | {
      direction?: 'asc' | 'desc' | 'ASC' | 'DESC';
      nulls?: 'first' | 'last' | 'FIRST' | 'LAST';
    };

/**
 * Make all properties in T optional with a type FindOptionsOrderValue
 */
export type PartialOrder<T> = {
  [A in keyof T]?: FindOptionsOrderValue;
};

export type DeepQueryType<T> = {
  [P in keyof T]?:
    | PartialDeep<T[P]>
    | DeepQueryType<T>
    | PartialDeep<(arg?: T[P]) => PartialDeep<T[P]>>;
};

export type PartialDeepOrder<T> =
  | FindOptionsOrderValue
  | (T extends (infer U)[]
      ? PartialDeepOrder<U>
      : T extends Map<infer K, infer V>
        ? Map<PartialDeepOrder<K>, PartialDeepOrder<V>>
        : T extends Set<infer M>
          ? Set<PartialDeepOrder<M>>
          : T extends object
            ? {
                [K in keyof T]?: PartialDeepOrder<T[K]>;
              }
            : FindOptionsOrderValue);

export type PartialDeep<T> =
  | T
  | (T extends (infer U)[]
      ? PartialDeep<U>[]
      : T extends Map<infer K, infer V>
        ? Map<PartialDeep<K>, PartialDeep<V>>
        : T extends Set<infer M>
          ? Set<PartialDeep<M>>
          : T extends object
            ? {
                [K in keyof T]?: PartialDeep<T[K]>;
              }
            : T);

export type PartialDeepBool<T> =
  | boolean
  | (T extends (infer U)[]
      ? PartialDeepBool<U>
      : T extends Map<infer K, infer V>
        ? Map<PartialDeepBool<K>, PartialDeepBool<V>>
        : T extends Set<infer M>
          ? Set<PartialDeepBool<M>>
          : T extends object
            ? {
                [K in keyof T]?: PartialDeepBool<T[K]>;
              }
            : boolean);
