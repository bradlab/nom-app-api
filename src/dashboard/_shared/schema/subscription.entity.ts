import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ATimestamp } from 'framework/timestamp.abstract';
import { ISubscription } from '../model/subscription.model';
import { Client } from '../model/client.model';
import { SubscriptionTypeEnum } from '../model/subscription.model';
import { ClientEntity } from './client.entity';

@Entity('subscriptions')
export class SubscriptionEntity extends ATimestamp implements ISubscription {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'enum',
    enum: SubscriptionTypeEnum,
  })
  type: SubscriptionTypeEnum;

  @Column({ nullable: true })
  value?: number; // en Mega octets (uniquement pour les forfaits)

  @Column({ nullable: true })
  duration: number; // Durée en jours

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  price: number;

  @ManyToOne(() => ClientEntity, (client) => client.subscriptions, { onDelete: 'CASCADE' })
  client: Client;

  @Column({ default: true })
  isActivated: boolean;
}
