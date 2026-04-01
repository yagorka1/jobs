import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Job } from '../jobs/job.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;

  @Column({ name: 'google_id', unique: true })
  public googleId: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @OneToMany(() => Job, (job) => job.user)
  public jobs: Job[];
}
