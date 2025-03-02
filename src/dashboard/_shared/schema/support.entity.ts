import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ATimestamp } from 'framework/timestamp.abstract';
import { SupportTicket } from '../model/transaction.model';
import { SubscriptionTypeEnum } from '../model/subscription.model';
import { ClientEntity } from './client.entity';
import { Client } from '../model/client.model';
import { Staff } from '../model/staff.model';
import { StaffEntity } from './staff.entity';

@Entity('supports')
export class SupportEntity
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

  @ManyToOne(() => ClientEntity, (client) => client.supports, {
    eager: true,
    onDelete: 'CASCADE',
  })
  client: Client; // Relation correcte avec l'objet ClientEntity

  @ManyToOne(() => StaffEntity, (manager) => manager.supports, {
    eager: true,
    onDelete: 'CASCADE',
  })
  manager: Staff;

  @ManyToOne(() => StaffEntity, (agent) => agent.supports, {
    eager: true,
    onDelete: 'CASCADE',
  })
  agent: Staff;
}
