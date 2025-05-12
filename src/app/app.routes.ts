import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './auth/guards/auth.guard';
import { PageComponent } from './core/page/page.component';
import { FaqComponent } from './faq/faq.component';
import { FaqUpsertComponent } from './faq/faq-upsert/faq-upsert.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ChatComponent } from './chat/chat.component';
import { authRoutes } from './auth/auth.routes';
import { configurationRoutes } from './configuration/configuration.route';
import { OfficeAttendanceComponent } from './office-attendance/office-attendance.component';

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
      { path: 'schedule', component: ScheduleComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'configuration', children: configurationRoutes },
      { path: 'attendances', component: OfficeAttendanceComponent },
    ]
  },
  { path: '**', redirectTo: 'auth' }
];

