import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ATimestamp } from 'framework/timestamp.abstract';
import { SupportTicket } from '../model/transaction.model';
import { SubscriptionTypeEnum } from '../model/subscription.model';
import { ClientEntity } from './client.entity';
import { Client } from '../model/client.model';

@Entity('supports')
export class TransactionEntity
  extends ATimestamp
  implements SupportTicket
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

  @ManyToOne(() => ClientEntity, (client) => client.support, {
    eager: true,
    onDelete: 'CASCADE',
  })
  client: Client; // Relation correcte avec l'objet ClientEntity
}
