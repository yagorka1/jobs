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
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  findById(id: string): Promise<User | null> {
    return this.repo.findOneBy({ id });
  }

  findByGoogleId(googleId: string): Promise<User | null> {
    return this.repo.findOneBy({ googleId });
  }

  create(data: CreateUserData): Promise<User> {
    return this.repo.save(this.repo.create(data));
  }
}
