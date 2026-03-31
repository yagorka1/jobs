import { Component } from '@angular/core';
import { LoginComponent } from '../features/login/login.component';

@Component({
  imports: [LoginComponent],
  selector: 'app-auth-entry',
  template: `<app-login></app-login>`,
})
export class RemoteEntry {}
