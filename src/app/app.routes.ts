import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { GoogleCallbackComponent } from './auth/callback/google-callback.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'auth/callback', component: GoogleCallbackComponent },
  { path: '**', redirectTo: 'login' }
];

