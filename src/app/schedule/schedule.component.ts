import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';

interface ScheduleConfig {
  start: string;
  end: string;
}

interface WeekDay {
  code: string;
  name: string;
  configs?: ScheduleConfig[];
}

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, ButtonComponent],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent {
  selectedService: string = '';
  selectedHealthService: string = '';
  procedureDuration: string = '30 min.';
  appointmentInterval: string = '30 min.';
  
  weekDays: WeekDay[] = [
    { 
      code: 'SEG', 
      name: 'Segunda',
      configs: [
        { start: '08:00', end: '18:00' },
        { start: '19:00', end: '22:00' }
      ]
    },
    { 
      code: 'TER', 
      name: 'Terça',
      configs: [
        { start: '08:00', end: '18:00' }
      ]
    },
    { 
      code: 'QUA', 
      name: 'Quarta',
      configs: [
        { start: '08:00', end: '18:00' }
      ]
    },
    { 
      code: 'QUI', 
      name: 'Quinta',
      configs: [
        { start: '08:00', end: '18:00' }
      ]
    },
    { 
      code: 'SEX', 
      name: 'Sexta',
      configs: [
        { start: '08:00', end: '18:00' }
      ]
    },
    { code: 'SAB', name: 'Sábado', configs: [] },
    { code: 'DOM', name: 'Domingo', configs: [] }
  ];

  healthServices = [
    { id: 1, name: 'Consulta Psicológica' },
    { id: 2, name: 'Avaliação Nutricional' },
    { id: 3, name: 'Fisioterapia' }
  ];

  configureSchedule(day: WeekDay) {
    if (!day.configs) {
      day.configs = [];
    }
    day.configs.push({ start: '08:00', end: '18:00' });
  }

  addSchedule(day: WeekDay) {
    if (!day.configs) {
      day.configs = [];
    }
    day.configs.push({ start: '08:00', end: '18:00' });
  }
}
