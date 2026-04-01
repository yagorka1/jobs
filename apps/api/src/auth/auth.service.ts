import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../common/interfaces';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  public constructor(private readonly jwtService: JwtService) {}

  public generateToken(user: User): string {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}
