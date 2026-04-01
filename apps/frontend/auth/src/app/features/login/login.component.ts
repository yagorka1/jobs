import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly authService: AuthService = inject(AuthService);

  public loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }
}
