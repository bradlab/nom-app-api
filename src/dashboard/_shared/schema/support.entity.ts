import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ATimestamp } from 'framework/timestamp.abstract';
import { SupportStatusEnum, SupportTicket, SupportTypeEnum } from '../model/support.model';
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
  message: string;

  @Column({ enum: SupportTypeEnum, nullable: true })
  type: SupportTypeEnum;

  @Column({ enum: SupportStatusEnum, nullable: true, default: SupportStatusEnum.PENDING })
  status: SupportStatusEnum;

  @ManyToOne(() => ClientEntity, (client) => client.supports, {
    eager: true,
    onDelete: 'CASCADE',
  })
  client: Client;

  @ManyToOne(() => StaffEntity, (agent) => agent.supports, {
    eager: true,
    onDelete: 'CASCADE',
  })
  agent: Staff;
}
