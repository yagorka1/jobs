export type JobStatus = 'applied' | 'interview' | 'offer' | 'rejected';

export interface Job {
  id: string;
  company: string;
  position: string;
  status: JobStatus;
  appliedAt: string;
  link?: string;
  notes?: string;
  createdAt: string;
  userId: string;
}

export interface CreateJobDto {
  company: string;
  position: string;
  status: JobStatus;
  appliedAt: string;
  link?: string;
  notes?: string;
}

export type UpdateJobDto = Partial<CreateJobDto>;
