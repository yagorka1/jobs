import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { AuthUser } from '../models/auth-user.model';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  public readonly user = signal<AuthUser | null>(null);

  public checkAuth(): Observable<boolean> {
    return this.http
      .get<AuthUser>(`${API_URL}/auth/me`, { withCredentials: true })
      .pipe(
        tap((user) => this.user.set(user)),
        map(() => true),
        catchError(() => {
          this.user.set(null);
          return of(false);
        })
      );
  }

  public logout(): Observable<void> {
    return this.http
      .post<void>(`${API_URL}/auth/logout`, {}, { withCredentials: true })
      .pipe(tap(() => this.user.set(null)));
  }
}
