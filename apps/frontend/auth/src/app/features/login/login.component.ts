import { Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly document = inject(DOCUMENT);

  readonly googleAuthUrl = `${environment.apiUrl}/auth/google`;

  loginWithGoogle(): void {
    this.navigateTo(this.googleAuthUrl);
  }

  protected navigateTo(url: string): void {
    this.document.location.href = url;
  }
}
