import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StepCpfCnpjComponent } from '../components/step-cpf-cnpj/step-cpf-cnpj.component';
import { NgSwitch, NgSwitchCase } from '@angular/common';
import { StepPasswordComponent } from '../components/step-password/step-password.component';

@Component({
  selector: 'app-individual',
  standalone: true,
  imports: [RouterModule, StepCpfCnpjComponent, NgSwitch, NgSwitchCase, StepPasswordComponent],
  templateUrl: './individual.component.html',
  styleUrl: './individual.component.scss'
})
export class IndividualComponent {
  step = 1;

  actionHandler() {
    if(this.step === 1) {
      this.step = 2;
    } else if(this.step === 2) {
      this.step = 3;
    }
  }
}
