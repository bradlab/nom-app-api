import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DBGenericRepository } from 'framework/database.repository';
import { Repository } from 'typeorm';
import { StaffEntity } from './schema/staff.entity';
import { Staff } from './model/staff.model';
import { IGenericRepository } from '../../_shared/domain/abstract';

export abstract class IDashboardRepository {
  users: IGenericRepository<Staff>;
}

@Injectable()
export class DashboardRepository
  implements IDashboardRepository, OnApplicationBootstrap
{
  users: DBGenericRepository<StaffEntity>;

  constructor(
    @InjectRepository(StaffEntity)
    private staffRepository: Repository<StaffEntity>,
  ) {}

  onApplicationBootstrap(): void {
    this.users = new DBGenericRepository<StaffEntity>(this.staffRepository);
  }
}
