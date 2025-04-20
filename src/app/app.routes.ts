import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { GoogleCallbackComponent } from './auth/callback/google-callback.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './auth/guards/auth.guard';
import { ScheduleComponent } from './schedule/schedule.component';
import { PageComponent } from './core/page/page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'auth/callback', component: GoogleCallbackComponent },
  {
    path: '',
    component: PageComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'schedule', component: ScheduleComponent },
    ]
  },
  { path: '**', redirectTo: 'login' }
];

