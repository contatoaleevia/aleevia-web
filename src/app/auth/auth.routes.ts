import { Routes } from '@angular/router';
import { BaseComponent } from '@auth/base/base.component';
import { LoginComponent } from '@auth/login/login.component';
import { WelcomeComponent } from '@auth/base/welcome/welcome.component'
import { RegisterComponent } from '@auth/base/register/register.component';
import { registerRoutes } from '@auth/base/register/register.routes';

export const authRoutes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      {
        path: 'welcome',
        component: WelcomeComponent
      },
      {
        path: 'register',
        component: RegisterComponent,
        children: registerRoutes
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full'
      }
    ]
  }
];
