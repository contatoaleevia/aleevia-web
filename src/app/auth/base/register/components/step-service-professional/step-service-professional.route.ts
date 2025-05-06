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
          subtitle: 'Adicione ou visualize os serviços oferecidos.'
        },
      },
      {
        path: 'add-service',
        component: RegisterComponent,
        data: {
          title: 'Adicionar serviço',
          subtitle: 'Adicione um novo serviço para o espaço.'
        },
      },
      {
        path: 'add-professional',
        component: RegisterComponent,
        data: {
          title: 'Adicionar profissional',
          subtitle: 'Adicione um novo profissional para o espaço.'
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
