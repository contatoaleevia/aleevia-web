import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';

interface OptionCard {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-step-congratulations',
  imports: [CommonModule, RouterModule],
  templateUrl: './step-congratulations.component.html',
  styleUrl: './step-congratulations.component.scss'
})
export class StepCongratulationsComponent implements OnInit {
  currentStep$ = new BehaviorSubject<number>(1);

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

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const stepId = parseInt(params['stepId'], 10);
      this.currentStep$.next(stepId);
    });
  }
}
