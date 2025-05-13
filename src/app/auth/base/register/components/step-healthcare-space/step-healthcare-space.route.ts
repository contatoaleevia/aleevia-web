import { Routes } from "@angular/router";
import { StepHealthcareSpaceComponent } from "./step-healthcare-space.component";

export const stepHealthcareSpaceRoute: Routes = [
  {
    path: 'healthcare-space',
    component: StepHealthcareSpaceComponent,
    data: {
      title: 'Seu perfil profissional',
      subtitle: 'Insira informações do seu espaço de saúde individual.'
    }
  }
]; 