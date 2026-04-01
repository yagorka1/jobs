import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('loginWithGoogle() delegates to AuthService', () => {
    const spy = vi.spyOn(authService, 'loginWithGoogle').mockImplementation(() => undefined);

    component.loginWithGoogle();

    expect(spy).toHaveBeenCalledOnce();
  });
});
