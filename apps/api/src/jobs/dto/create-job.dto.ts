import { IsDateString, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { JobStatus } from '../job.entity';

export class CreateJobDto {
  @IsString()
  public company: string;

  @IsString()
  public position: string;

  @IsEnum(JobStatus)
  @IsOptional()
  public status?: JobStatus;

  @IsDateString()
  public appliedAt: string;

  @IsUrl()
  @IsOptional()
  public link?: string;

  @IsString()
  @IsOptional()
  public notes?: string;
}
