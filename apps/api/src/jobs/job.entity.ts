import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';

export enum JobStatus {
  APPLIED = 'applied',
  INTERVIEW = 'interview',
  OFFER = 'offer',
  REJECTED = 'rejected',
}

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public company: string;

  @Column()
  public position: string;

  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.APPLIED })
  public status: JobStatus;

  @Column({ name: 'applied_at', type: 'date' })
  public appliedAt: string;

  @Column({ nullable: true })
  public link: string;

  @Column({ type: 'text', nullable: true })
  public notes: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @Column({ name: 'user_id' })
  public userId: string;

  @ManyToOne(() => User, (user) => user.jobs)
  @JoinColumn({ name: 'user_id' })
  public user: User;
}
