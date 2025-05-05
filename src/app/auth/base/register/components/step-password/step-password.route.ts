import { Routes } from "@angular/router";
import { StepPasswordComponent } from "./step-password.component";

export const stepPasswordRoute: Routes = [
  {
    path: 'password',
    component: StepPasswordComponent,
    data: {
      title: 'Senha de acesso',
      subtitle: 'Informações do seu espaço de saúde'
    }
  }
]; 