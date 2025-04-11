import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss'
})
export class StepperComponent {
  @Input() currentStep: number = 1;
  @Input() stepTitles: { [key: number]: string } = {};

  getStepTitle(step: number): string {
    return this.stepTitles[step] || '';
  }
}
