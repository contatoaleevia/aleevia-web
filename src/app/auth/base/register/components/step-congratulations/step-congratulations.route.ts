import { Routes } from "@angular/router";
import { StepCongratulationsComponent } from "./step-congratulations.component";

export const stepCongratulationsRoute: Routes = [
  {
    path: 'congratulations/:stepId',
    component: StepCongratulationsComponent,
  },
  {
    path: 'congratulations',
    redirectTo: 'congratulations/1',
    pathMatch: 'full'
  }
];
