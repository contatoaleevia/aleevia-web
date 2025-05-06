import { Routes } from "@angular/router";
import { StepServiceLocationComponent } from "./step-service-location.component";
import { TypeSelectComponent } from "./components/type-select/type-select.component";
import { AddressFormComponent } from "./components/address-form/address-form.component";
import { ConfirmationViewComponent } from "./components/confirmation-view/confirmation-view.component";

export const stepServiceLocationRoute: Routes = [
  {
    path: 'service-location',
    component: StepServiceLocationComponent,
    children: [
      {
        path: '',
        component: TypeSelectComponent,
        data: {
          title: 'Local de atendimento',
          subtitle: 'Selecione suas formas de atendimento'
        }
      },
      {
        path: 'address',
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