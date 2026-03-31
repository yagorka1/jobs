import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpInterceptorFn,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let router: { navigate: ReturnType<typeof vi.fn> };
  let authService: { user: ReturnType<typeof signal> };

  beforeEach(() => {
    router = { navigate: vi.fn() };
    authService = { user: signal(null) };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor as HttpInterceptorFn])),
        provideHttpClientTesting(),
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authService },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('passes through successful responses', () => {
    let body: unknown;
    http.get('/api/test').subscribe((r) => (body = r));

    httpMock.expectOne('/api/test').flush({ ok: true });

    expect(body).toEqual({ ok: true });
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('redirects to /login and clears user on 401', () => {
    let error: unknown;
    http.get('/api/test').subscribe({ error: (e) => (error = e) });

    httpMock.expectOne('/api/test').flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(authService.user()).toBeNull();
    expect(error).toBeTruthy();
  });

  it('does not redirect on non-401 errors', () => {
    http.get('/api/test').subscribe({ error: () => { /* expected */ } });

    httpMock.expectOne('/api/test').flush(null, { status: 500, statusText: 'Server Error' });

    expect(router.navigate).not.toHaveBeenCalled();
  });
});
