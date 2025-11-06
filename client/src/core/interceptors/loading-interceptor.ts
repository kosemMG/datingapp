import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { delay, finalize, Observable, of, tap } from 'rxjs';
import { inject } from '@angular/core';
import { BusyService } from '../services/busy.service';

const CACHE = new Map<string, HttpEvent<unknown>>();

export const loadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const busyService = inject(BusyService);

  if (req.method === 'GET') {
    const cachedResponse = CACHE.get(req.url);
    if (cachedResponse) {
      return of(cachedResponse);
    }
  }

  busyService.busy();

  return next(req).pipe(
    delay(500),
    tap((response: HttpEvent<unknown>) => CACHE.set(req.url, response)),
    finalize(() => busyService.idle())
  );
};
