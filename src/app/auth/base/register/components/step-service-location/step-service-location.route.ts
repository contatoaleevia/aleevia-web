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
        component: TypeSelectComponent
      },
      {
        path: 'address',
        component: AddressFormComponent
      },
      {
        path: 'confirmation',
        component: ConfirmationViewComponent
      }
    ]
  }
]; 