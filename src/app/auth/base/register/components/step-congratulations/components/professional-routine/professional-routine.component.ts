import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface OptionCard {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-professional-routine',
  imports: [CommonModule, RouterModule],
  templateUrl: './professional-routine.component.html',
  styleUrl: './professional-routine.component.scss'
})
export class ProfessionalRoutineComponent {
  
  optionCards: OptionCard[] = [
    {
      title: 'Criar serviços',
      description: 'Se você gerencia uma estrutura com mais de um profissional, mesmo que pequena, como consultório compartilhado, clínica multidisciplinar ou rede de atendimento.',
      icon: 'bi-buildings'
    },
    {
      title: 'Adicionar um profissional de saúde',
      description: 'Se você gerencia uma estrutura com mais de um profissional, mesmo que pequena, como consultório compartilhado, clínica multidisciplinar ou rede de atendimento.',
      icon: 'bi-buildings'
    },
    {
      title: 'Criar meu agente de saúde',
      description: 'Se você gerencia uma estrutura com mais de um profissional, mesmo que pequena, como consultório compartilhado, clínica multidisciplinar ou rede de atendimento.',
      icon: 'bi-buildings'
    }
  ];
}
