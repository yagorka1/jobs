import { Route } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'jobs',
    canActivate: [authGuard],
    loadChildren: () => import('jobs/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadChildren: () => import('auth/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: '',
    redirectTo: 'jobs',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'jobs',
  },
];
