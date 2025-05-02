import { Routes } from '@angular/router';
import { BaseComponent } from '@auth/base/base.component';
import { LoginComponent } from '@auth/login/login.component';
import { WelcomeComponent } from '@auth/base/welcome/welcome.component'
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
