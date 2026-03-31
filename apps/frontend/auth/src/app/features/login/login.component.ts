import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  readonly googleAuthUrl = `${environment.apiUrl}/auth/google`;

  loginWithGoogle(): void {
    window.location.href = this.googleAuthUrl;
  }
}
