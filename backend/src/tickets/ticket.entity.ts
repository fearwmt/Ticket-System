import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 5000 })
  description: string;

  @Column({ type: 'text' })
  priority: 'LOW' | 'MEDIUM' | 'HIGH';

  @Column({ type: 'text', default: 'OPEN' })
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
}
