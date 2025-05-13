import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { EMPTY, Observable, catchError, finalize } from 'rxjs';
import { OfficeService } from '@shared/services/office.service';
import { Office } from '@app/shared/models/office.model';
import { LoadingService } from '@app/core/services/loading.service';

export const officeResolver: ResolveFn<Office[]> = () => {
  const officeService = inject(OfficeService);
  const router = inject(Router);
  const loadingService = inject(LoadingService);

  loadingService.loadingOn();

  return officeService.getMyOffices().pipe(
    catchError((error) => {
      router.navigate(['/auth']);
      return EMPTY;
    }),
    finalize(() => loadingService.loadingOff())
  );
};
