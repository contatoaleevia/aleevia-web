import { Address } from '@app/shared/models/user.model';

export interface ScheduleConfig {
  start: string;
  end: string;
}

export interface WeekDay {
  code: string;
  name: string;
  selected?: boolean;
  value: number;
  configs?: ScheduleConfig[];
}

export interface Schedule {
  start: string;
  end: string;
}

export interface SchedulePayload {
  procedure_type: string;
  procedure_duration: number;
  procedure_value: number;
  schedules: {
    doctor_address_id: string;
    weekday: number;
    start_time: string;
    end_time: string;
  }[];
}

export interface ScheduleState {
  selectedService: string;
  selectedHealthService: string;
  procedureDuration: string;
  appointmentInterval: string;
  address?: Address;
  weekDays: WeekDay[];
} 