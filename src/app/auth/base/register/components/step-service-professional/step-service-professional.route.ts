import { Routes } from "@angular/router";
import { RegisterComponent } from "./register/register.component";
import { ViewNewComponent } from "./view-new/view-new.component";
export const stepServiceProfessionalRoute: Routes = [
  {
    path: 'service-professional',
    children: [
      {
        path: 'services',
        component: ViewNewComponent,
        data: {
          title: 'Serviços prestados',
          subtitle: 'Cadastre aqui serviços que seu espaço de saúde oferece.'
        },
      },
      {
        path: 'add-service',
        component: RegisterComponent,
        data: {
          title: 'Adicionar serviço',
          subtitle: 'Insira aqui informações sobre o serviço que seu espaço de saúde oferece.'
        },
      },
      {
        path: 'add-professional',
        component: RegisterComponent,
        data: {
          title: 'Adicionar profissional',
          subtitle: 'Insira as informações do profissional que deseja convidar para se juntar a Aleevia'
        },
      },
      {
        path: 'professionals',
        component: ViewNewComponent,
        data: {
          title: 'Profissionais',
          subtitle: 'Adicione ou visualize os profissionais do espaço.'
        },
      },
    ]
  }
];
