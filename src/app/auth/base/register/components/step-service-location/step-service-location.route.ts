import { Routes } from "@angular/router";
import { StepServiceLocationComponent } from "@auth/base/register/components/step-service-location/step-service-location.component";
import { AddressFormComponent } from "@auth/base/register/components/step-service-location/components/address-form/address-form.component";
import { ConfirmationViewComponent } from "@auth/base/register/components/step-service-location/components/confirmation-view/confirmation-view.component";

export const stepServiceLocationRoute: Routes = [
  {
    path: 'service-location',
    component: StepServiceLocationComponent,
    children: [
      {
        path: '',
        component: AddressFormComponent,
        data: {
          title: 'Vamos cadastrar o endereço',
          subtitle: 'Preencha as informações do seu espaço saúde.'
        }
      },
      {
        path: 'confirmation',
        component: ConfirmationViewComponent,
        data: {
          title: 'Local de atendimento',
          subtitle: 'Informações sobre formato de atendimento e locais.'
        }
      }
    ]
  }
]; 