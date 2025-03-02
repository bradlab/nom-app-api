/**
 * @fileoverview - Entity de la table Service comme Prestation
 * @module - prestation.entity
 * @description - Définition de l'entité prestation et de ses relations avec les autres entités
 */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { ATimestamp } from 'framework/timestamp.abstract';
import { SubscriptionEntity } from './subscription.entity';
import { ISubscription } from '../model/subscription.model';
import { TransactionEntity } from './transaction.entity';
import { Transaction } from '../model/transaction.model';
import { Prestation } from '../model/prestation.model';

@Entity('services')
export class PrestationEntity extends ATimestamp implements Prestation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true, default: true })
  isActivated?: boolean;

  @Column({type: 'simple-array', nullable: true}) // Pour gérer les images en tant que tableau simple
  images: string[];

  @Column()
  price: number;

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.prestation) // Relation avec Store
  subscriptions: ISubscription[];

  @OneToMany(
    () => TransactionEntity,
    (transaction) => transaction.subscription,
    { onDelete: 'SET NULL' },
  ) // Relation avec Transaction
  transactions: Transaction;
}
