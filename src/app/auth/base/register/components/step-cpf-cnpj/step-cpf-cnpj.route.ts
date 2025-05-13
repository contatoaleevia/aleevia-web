import { Routes } from "@angular/router";
import { StepCpfCnpjComponent } from "./step-cpf-cnpj.component";

export const stepCpfCnpjRoute: Routes = [
  {
    path: 'cpf-cnpj',
    component: StepCpfCnpjComponent,
    data: {
      title: 'Dados',
      subtitle: 'Insira aqui informações sobre você'
    }
  }
]; 