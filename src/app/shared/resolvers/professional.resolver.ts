import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { OfficeService } from '../services/office.service';
import { OfficeProfessional } from '../models/office.model';

export const professionalResolver: ResolveFn<OfficeProfessional[]> = () => {
  const officeService = inject(OfficeService);
  const officeId = localStorage.getItem('officeId') || '';
  return officeService.getProfessionals(officeId);
};