import { Routes } from "@angular/router";
import { StartComponent } from "./start/start.component";
import { stepCongratulationsRoute } from "@auth/base/register/components/step-congratulations/step-congratulations.route";
import { stepCpfCnpjRoute } from "@auth/base/register/components/step-cpf-cnpj/step-cpf-cnpj.route";
import { stepPasswordRoute } from "@auth/base/register/components/step-password/step-password.route";
import { stepServiceLocationRoute } from "@auth/base/register/components/step-service-location/step-service-location.route";
import { stepServiceProfessionalRoute } from "@auth/base/register/components/step-service-professional/step-service-professional.route";
import { stepHealthcareSpaceRoute } from "@auth/base/register/components/step-healthcare-space/step-healthcare-space.route";
export const registerRoutes: Routes = [
  {
    path: 'start',
    component: StartComponent
  },
  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full'
  },
  {
    path: 'step',
    children: [
      ...stepCpfCnpjRoute,
      ...stepPasswordRoute,
      ...stepHealthcareSpaceRoute,
      ...stepServiceLocationRoute,
      ...stepServiceProfessionalRoute,
      ...stepCongratulationsRoute
    ]
  },
];