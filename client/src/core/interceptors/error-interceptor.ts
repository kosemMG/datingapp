import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { NavigationExtras, Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    catchError(error => {
      if (error) {
        switch (error.status) {
          case 400:
            if (error?.error?.errors) {
              throw Object.values(error.error.errors)
                .filter(Boolean)
                .flat() as string[];
            }
            toast.error(`${error.error} - ${error.status}`);
            break;
          case 401:
            toast.error('Unauthorized - 401');
            break;
          case 404:
            router.navigateByUrl('/not-found');
            break;
          case 500:
            const extras: NavigationExtras = { state: { error: error.error } };
            router.navigateByUrl('/server-error', extras);
            break;
          default:
            toast.error('Something went wrong');
            break;
        }
      }
      throw error;
    })
  );
};
