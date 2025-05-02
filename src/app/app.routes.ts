import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { GoogleCallbackComponent } from './auth/callback/google-callback.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './auth/guards/auth.guard';
import { PageComponent } from './core/page/page.component';
import { FaqComponent } from './faq/faq.component';
import { FaqUpsertComponent } from './faq/faq-upsert/faq-upsert.component';
import { ChatComponent } from './chat/chat.component';
import { authRoutes } from './auth/auth.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    children: authRoutes
  },
  {
    path: '',
    component: PageComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'faq', component: FaqComponent },
      { path: 'faq/new', component: FaqUpsertComponent },
      { path: 'faq/edit/:id', component: FaqUpsertComponent },
      { path: 'chat', component: ChatComponent },
    ]
  },
  { path: '**', redirectTo: 'auth' }
];

