import { Routes } from "@angular/router";
import { StepHealthcareSpaceComponent } from "./step-healthcare-space.component";

export const stepHealthcareSpaceRoute: Routes = [
  {
    path: 'healthcare-space',
    component: StepHealthcareSpaceComponent,
    data: {
      title: 'Espaço de atendimento',
      subtitle: 'Informações do seu espaço de atendimento.'
    }
  }
]; 