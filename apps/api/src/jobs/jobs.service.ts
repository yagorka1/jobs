import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './job.entity';

@Injectable()
export class JobsService {
  public constructor(@InjectRepository(Job) private readonly repo: Repository<Job>) {}

  public findAll(userId: string): Promise<Job[]> {
    return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  public create(userId: string, dto: CreateJobDto): Promise<Job> {
    return this.repo.save(this.repo.create({ ...dto, userId }));
  }

  public async update(id: string, userId: string, dto: UpdateJobDto): Promise<Job> {
    const job = await this.findOneOrFail(id, userId);
    return this.repo.save({ ...job, ...dto });
  }

  public async remove(id: string, userId: string): Promise<void> {
    const job = await this.findOneOrFail(id, userId);
    await this.repo.remove(job);
  }

  private async findOneOrFail(id: string, userId: string): Promise<Job> {
    const job = await this.repo.findOneBy({ id });
    if (!job) throw new NotFoundException();
    if (job.userId !== userId) throw new ForbiddenException();
    return job;
  }
}
