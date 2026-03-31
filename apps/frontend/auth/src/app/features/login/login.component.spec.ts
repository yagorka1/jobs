import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('has googleAuthUrl ending with /auth/google', () => {
    expect(component.googleAuthUrl).toMatch(/\/auth\/google$/);
  });

  it('loginWithGoogle() navigates to googleAuthUrl', () => {
    const navigateSpy = vi.spyOn(component, 'navigateTo');

    component.loginWithGoogle();

    expect(navigateSpy).toHaveBeenCalledWith(component.googleAuthUrl);
  });
});
