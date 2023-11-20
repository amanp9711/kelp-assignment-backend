import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column({ type: 'jsonb', nullable: true })
  address: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  additional_info: Record<string, any>;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;
}
