import { Routes } from "@angular/router";
import { StartComponent } from "./start/start.component";
import { stepCongratulationsRoute } from "@auth/base/register/components/step-congratulations/step-congratulations.route";
import { stepCpfCnpjRoute } from "@auth/base/register/components/step-cpf-cnpj/step-cpf-cnpj.route";
import { stepPasswordRoute } from "@auth/base/register/components/step-password/step-password.route";
import { stepServiceLocationRoute } from "@auth/base/register/components/step-service-location/step-service-location.route";
import { stepServiceProfessionalRoute } from "@auth/base/register/components/step-service-professional/step-service-professional.route";
import { registrationGuard } from "@auth/guards/registration.guard";
import { REGISTRATION_TYPES } from "./constants/registration-types";
export const registerRoutes: Routes = [
  {
    path: '',
    component: StartComponent
  },
  {
    path: REGISTRATION_TYPES.INDIVIDUAL,
    redirectTo: `${REGISTRATION_TYPES.INDIVIDUAL}/cpf-cnpj`,
    pathMatch: 'full'
  },
  {
    path: REGISTRATION_TYPES.INDIVIDUAL,
    canActivate: [registrationGuard],
    children: [
      ...stepCpfCnpjRoute,
      ...stepPasswordRoute,
      ...stepServiceLocationRoute,
      ...stepServiceProfessionalRoute,
      ...stepCongratulationsRoute
    ]
  },
  {
    path: REGISTRATION_TYPES.CLINIC,
    canActivate: [registrationGuard],
    children: [
      ...stepCpfCnpjRoute,
      ...stepPasswordRoute,
      ...stepServiceLocationRoute,
      ...stepServiceProfessionalRoute,
      ...stepCongratulationsRoute
    ]
  }
];