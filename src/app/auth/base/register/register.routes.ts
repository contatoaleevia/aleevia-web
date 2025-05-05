import { Routes } from "@angular/router";
import { StartComponent } from "./start/start.component";
import { stepCongratulationsRoute } from "@auth/base/register/components/step-congratulations/step-congratulations.route";
import { stepCpfCnpjRoute } from "@auth/base/register/components/step-cpf-cnpj/step-cpf-cnpj.route";
import { stepPasswordRoute } from "@auth/base/register/components/step-password/step-password.route";
import { stepServiceLocationRoute } from "@auth/base/register/components/step-service-location/step-service-location.route";
import { RegisterComponent } from "@auth/base/register/register.component";
import { registrationGuard } from "@auth/guards/registration.guard";

export const registerRoutes: Routes = [
  {
    path: '',
    component: StartComponent
  },
  {
    path: 'individual',
    redirectTo: 'individual/cpf-cnpj',
    pathMatch: 'full'
  },
  {
    path: 'individual',
    component: RegisterComponent,
    canActivate: [registrationGuard],
    children: [
      ...stepCpfCnpjRoute,
      ...stepPasswordRoute,
      ...stepServiceLocationRoute,
      ...stepCongratulationsRoute
    ]
  },
  {
    path: 'clinic',
    component: RegisterComponent,
    canActivate: [registrationGuard],
    children: [
      ...stepCpfCnpjRoute,
      ...stepPasswordRoute,
      ...stepServiceLocationRoute,
      ...stepCongratulationsRoute
    ]
  }
];