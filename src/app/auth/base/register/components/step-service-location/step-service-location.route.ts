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
          title: 'Endereço do local',
          subtitle: 'Informe o endereço do seu local de atendimento'
        }
      },
      {
        path: 'confirmation',
        component: ConfirmationViewComponent,
        data: {
          title: 'Confirmação',
          subtitle: 'Confira os dados do seu local de atendimento'
        }
      }
    ]
  }
]; 