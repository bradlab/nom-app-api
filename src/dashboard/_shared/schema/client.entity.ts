import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ATimestamp } from 'framework/timestamp.abstract';
import { SupportTicket } from '../model/support.model';
import { SupportEntity } from './support.entity';
import { ISubscription } from '../model/subscription.model';
import { SubscriptionEntity } from './subscription.entity';
import { Client } from '../model/client.model';
import { Exclude } from 'class-transformer';
import { SexEnum } from 'app/enum';

@Entity('clients')
@Index(['phone'], { unique: true, where: `deleted_at IS NULL` })
@Index(['email'], { unique: true, where: `deleted_at IS NULL` })
export class ClientEntity extends ATimestamp implements Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  email?: string;

  @Column()
  phone?: string;

  @Column({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  latsname: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  NIF?: string;

  @Column({ nullable: true })
  labelName?: string;

  @Column({ nullable: true, enum: SexEnum })
  sex?: SexEnum;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true, default: false })
  isBusiness?: boolean;

  @Column({ nullable: true, default: true })
  isActivated?: boolean;

  @Exclude()
  @Column()
  password: string;

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.client, {
    onDelete: 'CASCADE',
  })
  subscriptions: ISubscription[];

  @OneToMany(() => SupportEntity, (support) => support.client, {onDelete: 'CASCADE'})
  supports?: SupportTicket[];
}
