import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { of } from 'rxjs';
import { authGuard, guestGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

function runGuard(guard: typeof authGuard, isAuthenticated: boolean): boolean | UrlTree {
  const authService = TestBed.inject(AuthService);
  vi.spyOn(authService, 'checkAuth').mockReturnValue(of(isAuthenticated));

  let result!: boolean | UrlTree;
  TestBed.runInInjectionContext(() => {
    (guard as () => ReturnType<typeof authGuard>)().subscribe((v: boolean | UrlTree) => (result = v));
  });
  return result;
}

describe('authGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { checkAuth: vi.fn(), user: { set: vi.fn() } } },
        {
          provide: Router,
          useValue: { createUrlTree: (path: string[]) => path, navigate: vi.fn() },
        },
      ],
    });
  });

  it('returns true when authenticated', () => {
    expect(runGuard(authGuard, true)).toBe(true);
  });

  it('redirects to /login when not authenticated', () => {
    const result = runGuard(authGuard, false);
    expect(result).toEqual(['/login']);
  });
});

describe('guestGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { checkAuth: vi.fn(), user: { set: vi.fn() } } },
        {
          provide: Router,
          useValue: { createUrlTree: (path: string[]) => path, navigate: vi.fn() },
        },
      ],
    });
  });

  it('returns true when not authenticated', () => {
    expect(runGuard(guestGuard, false)).toBe(true);
  });

  it('redirects to /jobs when already authenticated', () => {
    const result = runGuard(guestGuard, true);
    expect(result).toEqual(['/jobs']);
  });
});
