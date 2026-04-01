import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { CurrentUser } from '../common/decorators';
import { JwtAuthGuard } from '../common/guards';
import { AuthenticatedUser } from '../common/interfaces';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  public constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  public googleAuth(): void { /* handled by Passport guard */ }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  public googleCallback(@CurrentUser() user: User, @Res() res: Response): void {
    const token = this.authService.generateToken(user);
    res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect(this.config.get('FRONTEND_URL') + '/jobs');
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  public me(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }

  @Post('logout')
  public logout(@Res() res: Response): void {
    res.clearCookie('access_token');
    res.json({ ok: true });
  }
}
