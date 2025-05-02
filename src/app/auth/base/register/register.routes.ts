import { Routes } from "@angular/router";
import { IndividualComponent } from "./individual/individual.component";
import { StartComponent } from "./start/start.component";
import { ClinicComponent } from "./clinic/clinic.component";
export const registerRoutes: Routes = [
  {
    path: '',
    component: StartComponent
  },
  {
    path: 'individual',
    component: IndividualComponent
  },
  {
    path: 'clinic',
    component: ClinicComponent
  }
];