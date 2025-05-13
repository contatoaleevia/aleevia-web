import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { EMPTY, Observable, catchError, finalize, map } from 'rxjs';
import { OfficeService } from '@shared/services/office.service';
import { Office, OfficeResponse } from '@app/shared/models/office.model';
import { LoadingService } from '@app/core/services/loading.service';

export const officeResolver: ResolveFn<Office[]> = () => {
  const officeService = inject(OfficeService);
  const router = inject(Router);
  const loadingService = inject(LoadingService);

  loadingService.loadingOn();

  return officeService.getMyOffices().pipe(
    map((response: OfficeResponse[]) => {
      return response.map(item => {
        localStorage.setItem('officeId', item.office.id || '');
        return item.office;
      });
    }),
    catchError((error) => {
      console.error('Error fetching offices:', error);
      router.navigate(['/auth']);
      return EMPTY;
    }),
    finalize(() => loadingService.loadingOff())
  );
};
