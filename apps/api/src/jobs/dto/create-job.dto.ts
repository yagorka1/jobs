import { IsDateString, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { JobStatus } from '../job.entity';

export class CreateJobDto {
  @IsString()
  company: string;

  @IsString()
  position: string;

  @IsEnum(JobStatus)
  @IsOptional()
  status?: JobStatus;

  @IsDateString()
  appliedAt: string;

  @IsUrl()
  @IsOptional()
  link?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
