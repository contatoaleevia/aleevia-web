import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../shared/components/input/input.component';
import { WeekDay, Schedule, SchedulePayload } from '../../models/schedule.model';

@Component({
  selector: 'app-step-2',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
  ],
  templateUrl: './step-2.component.html',
  styleUrl: './step-2.component.scss'
})
export class Step2Component implements OnInit {
  @Input() doctorAddressId!: string;
  @Output() formValidityChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<SchedulePayload>();
  
  weekDays: WeekDay[] = [
    { code: 'S', name: 'Segunda', selected: false, value: 1 },
    { code: 'T', name: 'Terça', selected: false, value: 2 },
    { code: 'Q', name: 'Quarta', selected: false, value: 3 },
    { code: 'Q', name: 'Quinta', selected: false, value: 4 },
    { code: 'S', name: 'Sexta', selected: false, value: 5 },
    { code: 'S', name: 'Sábado', selected: false, value: 6 },
    { code: 'S', name: 'Domingo', selected: false, value: 7 }
  ];

  scheduleForm: FormGroup;
  currentSchedules: Schedule[] = [];

  constructor(private fb: FormBuilder) {
    this.scheduleForm = this.fb.group({
      service: [{ value: 'Consulta', disabled: true }],
      procedureValue: ['', [Validators.required, Validators.min(0)]],
      schedules: this.fb.array([
        this.createScheduleGroup()
      ])
    });
  }

  ngOnInit(): void {
    this.checkFormValidity();
    this.updateCurrentSchedules();
    
    this.scheduleForm.valueChanges.subscribe(() => {
      this.checkFormValidity();
      this.updateCurrentSchedules();
    });
  }

  get schedules(): FormArray {
    return this.scheduleForm.get('schedules') as FormArray;
  }

  createScheduleGroup(): FormGroup {
    return this.fb.group({
      start: ['', [Validators.required, Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$')]],
      end: ['', [Validators.required, Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$')]]
    });
  }

  onTimeInputChange(event: Event, scheduleIndex: number, field: 'start' | 'end'): void {
    const input = event.target as HTMLInputElement;
    const scheduleGroup = this.schedules.at(scheduleIndex) as FormGroup;
    
    if (input.value.includes(':')) {
      scheduleGroup.get(field)?.setValue(input.value);
    }
  }

  toggleDay(day: WeekDay): void {
    day.selected = !day.selected;
    this.checkFormValidity();
  }

  addSchedule(): void {
    this.schedules.push(this.createScheduleGroup());
    this.updateCurrentSchedules();
  }

  removeSchedule(index: number): void {
    this.schedules.removeAt(index);
    this.updateCurrentSchedules();
  }

  private updateCurrentSchedules(): void {
    this.currentSchedules = this.schedules.controls.map(control => ({
      start: control.get('start')?.value || '',
      end: control.get('end')?.value || ''
    }));
  }

  private checkFormValidity(): void {
    const hasSelectedDay = this.weekDays.some(day => day.selected);
    const isScheduleValid = this.scheduleForm.valid;
    this.formValidityChange.emit(hasSelectedDay && isScheduleValid);
    if(isScheduleValid) {
      this.saveSchedule();
    }
  }

  saveSchedule(): void {
    if (!this.scheduleForm.valid) return;

    const formValue = this.scheduleForm.getRawValue();
    const selectedDays = this.weekDays.filter(day => day.selected);
    
    const procedureValue = Number(
      formValue.procedureValue
        .replace('R$ ', '')
        .replace(',', '.')
    );

    const schedules = selectedDays.flatMap(day => {
      return this.currentSchedules.map(schedule => {
        const startTime = schedule.start ? `${schedule.start}:00` : '';
        const endTime = schedule.end ? `${schedule.end}:00` : '';
        
        return {
          doctor_address_id: this.doctorAddressId,
          weekday: day.value,
          start_time: startTime,
          end_time: endTime
        };
      });
    });

    const payload: SchedulePayload = {
      procedure_type: 'consulta',
      procedure_duration: 30,
      procedure_value: procedureValue,
      schedules: schedules
    };

    this.save.emit(payload);
  }
}
