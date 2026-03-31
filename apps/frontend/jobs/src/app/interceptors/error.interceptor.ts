import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { HANDLE_ERROR_LOCALLY } from '../constants/http-context.constants';
import { extractError } from '../utils/extract-error.util';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (!req.context.get(HANDLE_ERROR_LOCALLY)) {
        snackBar.open(extractError(err), 'Close', {
          duration: 4000,
          panelClass: 'snack-error',
        });
      }
      return throwError(() => err);
    })
  );
};
