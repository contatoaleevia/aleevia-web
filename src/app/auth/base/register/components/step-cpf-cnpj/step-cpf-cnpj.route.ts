import { Routes } from "@angular/router";
import { StepCpfCnpjComponent } from "./step-cpf-cnpj.component";

export const stepCpfCnpjRoute: Routes = [
  {
    path: 'cpf-cnpj',
    component: StepCpfCnpjComponent,
    data: {
      title: 'Seus dados',
      subtitle: 'Informações do seu espaço de saúde.'
    }
  }
]; 