import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ATimestamp } from 'framework/timestamp.abstract';
import { Transaction, SubscriptionTypeEnum } from '../model/transaction.model';
import { ClientEntity } from './client.entity';
import { Client } from '../model/client.model';
import { ISubscription } from '../model/subscription.model';
import { SubscriptionEntity } from './subscription.entity';

@Entity('transactions')
export class TransactionEntity
  extends ATimestamp
  implements Transaction
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount: number;

  @Column({ nullable: true })
  description: string;

  @Column({ enum: SubscriptionTypeEnum, nullable: true })
  type: SubscriptionTypeEnum;

  @Column({ default: true })
  isActivated: boolean;

  @ManyToOne(() => ClientEntity, (client) => client.histories, {
    eager: true,
    onDelete: 'CASCADE',
  })
  client: Client; // Relation correcte avec l'objet ClientEntity

  @ManyToOne(() => SubscriptionEntity, (sub) => sub.transactions, {
    eager: true,
    onDelete: 'CASCADE',
  }) // Relation avec l'annonce
  subscription: ISubscription;
}
