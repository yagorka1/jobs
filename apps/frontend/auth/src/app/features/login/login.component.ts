import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  readonly googleAuthUrl = 'http://localhost:3000/auth/google';

  loginWithGoogle(): void {
    window.location.href = this.googleAuthUrl;
  }
}
