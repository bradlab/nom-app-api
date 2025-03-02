import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { PrestationEntity } from './prestation.entity';
import { Prestation } from '../model/prestation.model';
import { ATimestamp } from 'framework/timestamp.abstract';
import { ISubscription } from '../model/subscription.model';
import { ClientEntity } from './client.entity';
import { Client } from '../model/client.model';
import { TransactionEntity } from './transaction.entity';
import { Transaction, SubscriptionTypeEnum } from '../model/transaction.model';

@Entity('subscriptions')
export class SubscriptionEntity extends ATimestamp implements ISubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ default: true })
  isActivated: boolean;

  @Column({ enum: SubscriptionTypeEnum, nullable: true })
  type: SubscriptionTypeEnum;

  @Column({ nullable: true, type: 'timestamp with time zone' })
  startAt: Date;

  @Column({ nullable: true, type: 'timestamp with time zone' })
  dueDate: Date;

  @Column({ nullable: true, type: 'timestamp with time zone' })
  closedAt: Date;

  @ManyToOne(() => ClientEntity, (client) => client.subscriptions)
  client?: Client;

  @ManyToOne(() => PrestationEntity, (annonce) => annonce.subscriptions, {
    onDelete: 'NO ACTION',
  })
  prestation?: Prestation;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.subscription, {
    onDelete: 'NO ACTION',
  })
  transactions?: Transaction[];
}
