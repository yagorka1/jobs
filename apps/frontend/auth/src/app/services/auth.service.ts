import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly document: Document = inject(DOCUMENT);

  public readonly googleAuthUrl: string = `${environment.apiUrl}/auth/google`;

  public loginWithGoogle(): void {
    this.navigateTo(this.googleAuthUrl);
  }

  protected navigateTo(url: string): void {
    this.document.location.href = url;
  }
}
