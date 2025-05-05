import { Routes } from "@angular/router";
import { CongratulationsComponent } from "./components/congratulations/congratulations.component";
import { ProfessionalRoutineComponent } from "./components/professional-routine/professional-routine.component";

export const stepCongratulationsRoute: Routes = [
  {
    path: 'congratulations/1',
    component: CongratulationsComponent,
  },
  {
    path: 'congratulations/2',
    component: ProfessionalRoutineComponent,
  },
  {
    path: 'congratulations',
    redirectTo: 'congratulations/1',
    pathMatch: 'full'
  }
];
