import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ATimestamp } from 'framework/timestamp.abstract';
import { RoleEnum, SexEnum } from 'app/enum/global.enum';
import { Staff } from '../model/staff.model';
import { SupportTicket } from '../model/support.model';
import { SupportEntity } from './support.entity';

@Entity('users')
@Index(['phone'], { unique: true, where: `deleted_at IS NULL` })
@Index(['email'], { unique: true, where: `deleted_at IS NULL` })
export class StaffEntity extends ATimestamp implements Staff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  email?: string;

  @Column()
  phone?: string;

  @Column({ nullable: true })
  firstname?: string;

  @Column({ nullable: true })
  lastname?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true, enum: SexEnum, default: SexEnum.UNKNOWN })
  sex?: SexEnum;

  @Column({ nullable: true, enum: RoleEnum })
  role: RoleEnum;

  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: true })
  code?: string;

  @Column({ nullable: true, default: true })
  isActivated?: boolean;

  @OneToMany(() => SupportEntity, (support) => support.agent, {onDelete: 'CASCADE'})
  supports?: SupportTicket[];
}
