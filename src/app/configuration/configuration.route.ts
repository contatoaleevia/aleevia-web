import { Route } from "@angular/router";
import { ConfigurationComponent } from "./configuration.component";
import { OfficeComponent } from "./office/office.component";
import { officeResolver } from "./office/office.resolver";

export const configurationRoutes: Route[] = [
  {
    path: '',
    component: ConfigurationComponent
  },
  {
    path: 'office/:id',
    component: OfficeComponent,
    resolve: {
      office: officeResolver
    }
  }
]