import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../services/auth.service';
import { AuthUser } from '../../models/auth-user.model';

const mockUser: AuthUser = { id: 'u1', email: 'test@test.com', name: 'Test User' };

describe('NavbarComponent', () => {
  let fixture: ComponentFixture<NavbarComponent>;
  let component: NavbarComponent;
  let authService: { logout: ReturnType<typeof vi.fn>; user: ReturnType<typeof signal<AuthUser | null>> };
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authService = { logout: vi.fn().mockReturnValue(of(undefined)), user: signal<AuthUser | null>(null) };
    router = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [NavbarComponent, NoopAnimationsModule],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('calls authService.logout() and navigates to /login on logout()', () => {
    (component as unknown as { logout: () => void }).logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('renders user name when user is set', () => {
    authService.user.set(mockUser);
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.textContent).toContain('Test User');
  });
});
