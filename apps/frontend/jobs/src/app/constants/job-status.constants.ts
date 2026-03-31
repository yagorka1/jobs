import { JobStatus } from '../models/job.model';

export interface JobStatusOption {
  value: JobStatus;
  label: string;
}

export const JOB_STATUS_OPTIONS: JobStatusOption[] = [
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
];
