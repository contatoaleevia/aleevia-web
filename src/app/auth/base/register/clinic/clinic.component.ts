import { Component } from '@angular/core';
import { StepCpfCnpjComponent } from '../components/step-cpf-cnpj/step-cpf-cnpj.component';
import { NgSwitch, NgSwitchCase } from '@angular/common';
@Component({
  selector: 'app-clinic',
  imports: [StepCpfCnpjComponent, NgSwitch, NgSwitchCase],
  templateUrl: './clinic.component.html',
  styleUrl: './clinic.component.scss'
})
export class ClinicComponent {
  step = 1;

  actionHandler() {
    if(this.step === 1) {
      this.step = 2;
    }
  }
}
