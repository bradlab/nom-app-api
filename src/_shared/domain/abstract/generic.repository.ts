import {
  DeepQueryType,
  PartialDeep,
  PartialDeepBool,
  PartialDeepOrder,
} from 'domain/types';

export interface RepoParam<T> {
  relations?: PartialDeepBool<T>;
  select?: PartialDeepBool<T>;
  where?: DeepQueryType<T> | DeepQueryType<T>[];
  withDeleted?: boolean;
  order?: PartialDeepOrder<T>;
  skip?: number;
  take?: number;
}
export abstract class IGenericRepository<T> {
  abstract findBy(options: DeepQueryType<T>): Promise<T[]>;

  abstract findOneByID(id: string, options?: RepoParam<T>): Promise<T>;

  abstract findOneBy(options: DeepQueryType<T>): Promise<T>;

  // Méthode pour récupérer une liste d'entités
  abstract find(options?: RepoParam<T>): Promise<T[]>;

  // Méthode pour récupérer une liste d'entités par leurs identifiants
  abstract findByIds(ids: string[], options?: DeepQueryType<T>): Promise<T[]>;

  // Méthode pour récupérer des entités avec un comptage
  abstract findAndCount(options?: RepoParam<T>): Promise<[T[], number]>; // [list of entities, total count]

  // Méthode pour obtenir le nombre d'entités correspondant à des critères
  abstract count(options?: RepoParam<T>): Promise<number>;

  // Méthode pour obtenir le nombre d'entités correspondant à des critères spécifiques
  abstract countBy(options?: DeepQueryType<T>): Promise<number>;

  abstract findForLogin(options: PartialDeep<T>): Promise<T>;

  abstract findOne(options: RepoParam<T>): Promise<T>;
  // Somme d'un champ spécifique
  abstract sum(field: keyof T, options?: RepoParam<T>): Promise<number>;

  // Moyenne d'un champ spécifique
  abstract average(field: keyof T, options?: RepoParam<T>): Promise<number>;

  // Valeur minimale d'un champ spécifique
  abstract min(field: keyof T, options?: RepoParam<T>): Promise<number>;

  // Valeur maximale d'un champ spécifique
  abstract max(field: keyof T, options?: RepoParam<T>): Promise<number>;

  // Supprimer tout de la table
  abstract clear(): Promise<void>;

  abstract create(options: T): Promise<T>;

  abstract createMany(items: T[]): Promise<T[]>;

  abstract updateMany(items: T[]): Promise<T[]>;

  abstract update(item: T): Promise<T>;

  abstract clean(item: T | T[]): Promise<T | T[]>;

  abstract removeMany(item: T[]): Promise<T[]>;

  abstract remove(item: T): Promise<T>;
}
