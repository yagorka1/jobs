import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

export interface CreateUserData {
  email: string;
  name: string;
  googleId: string;
}

@Injectable()
export class UsersService {
  public constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  public findById(id: string): Promise<User | null> {
    return this.repo.findOneBy({ id });
  }

  public findByGoogleId(googleId: string): Promise<User | null> {
    return this.repo.findOneBy({ googleId });
  }

  public create(data: CreateUserData): Promise<User> {
    return this.repo.save(this.repo.create(data));
  }
}
