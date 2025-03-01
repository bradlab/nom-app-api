/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { In, ObjectLiteral, Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { IGenericRepository } from 'domain/abstract';
import { DataHelper } from 'adapter/helper/data.helper';

export class DBGenericRepository<T extends ObjectLiteral> implements IGenericRepository<T> {
  private _repository: Repository<T>;
  private readonly logger = new Logger();

  constructor(repository: Repository<T>) {
    this._repository = repository;
  }

  find(options?: any): Promise<T[]> {
    return this._repository.find({ ...options });
  }

  findBy(options: any): Promise<T[]> {
    return this._repository.find({ ...options });
  }

  findAndCount(options: any): Promise<[T[], number]> {
    return this._repository.findAndCount({ ...options });
  }

  async count(options: any): Promise<number> {
    return this._repository.count({ ...options });
  }

  async countBy(options: any): Promise<number> {
    return this._repository.countBy({ ...options });
  }

  async sum(field: any, options?: any): Promise<number> {
    return await this._repository.sum(field, options) || 0 as unknown as number;
  }

  async average(field: any, options?: any): Promise<number> {
    return await this._repository.average(field, options) || 0 as unknown as number;
  }

  async min(field: any, options?: any): Promise<number> {
    return await this._repository.minimum(field, options)  || 0 as unknown as number;
  }

  async max(field: any, options?: any): Promise<number> {
    return await this._repository.maximum(field, options) || 0 as unknown as number;
  }

  async findOneByID(id: string, options?: any): Promise<T> {
    this.logger.debug({ target: this._repository.target });
    if (id) {
      options = { ...options, where: { ...options?.where, id } };
      return await this._repository.findOne(options) as unknown as T;
    }
    return null as unknown as T;
  }

  async findByIds(ids: string[], options: any): Promise<T[]> {
    const customQuery = { id: In(ids), ...options };
    if (DataHelper.isNotEmptyArray(ids)) {
      return await this._repository.findBy({ ...customQuery });
    }
    return [];
  }

  async findOne(options: any): Promise<T> {
    return this._repository.findOne({ ...options }) as unknown as T;
  }

  async findForLogin(options: any): Promise<T> {
    return await this._repository.findOne({
      ...options,
      select: { ...options?.select, password: true },
    }) as unknown as T;
  }

  async findOneBy(options: any): Promise<T> {
    return await this._repository.findOneBy(options) as unknown as T;
  }

  async create(item: T): Promise<T> {
    return this._repository.save(item);
  }

  async createMany(items: T[]): Promise<T[]> {
    return this._repository.save(items);
  }

  async updateMany(items: T[]): Promise<T[]> {
    return this._repository.save(items);
  }

  update(item: T): Promise<T> {
    return this._repository.save(item);
  }

  clean(items: any): Promise<any> {
    // This method remove permanently
    return this._repository.remove(items);
  }

  /**
   * @description Clears all the data from the given table/collection (truncates/drops it).
   * @returns void
   */
  clear(): Promise<void> {
    return this._repository.clear();
  }

  removeMany(items: T[]): Promise<T[]> {
    return this._repository.softRemove(items);
  }

  remove(item: T): Promise<T> {
    return this._repository.softRemove(item);
  }

  // Implémentation de la méthode restore
  async restore(ids: string[]): Promise<void> {
    await this._repository.restore(ids); // Appel de la méthode restore fournie par TypeORM
  }
}
