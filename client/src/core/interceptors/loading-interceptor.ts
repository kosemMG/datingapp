import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpParams, HttpRequest } from '@angular/common/http';
import { delay, finalize, Observable, of, tap } from 'rxjs';
import { inject } from '@angular/core';
import { BusyService } from '../services/busy.service';

const CACHE = new Map<string, HttpEvent<unknown>>();

export const loadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const busyService = inject(BusyService);

  const generateCacheKey = (url: string, params: HttpParams): string => {
    const paramString = params.keys()
      .map(key => `${key}=${params.get(key)}`)
      .join('&');
    return paramString ? `${url}?${paramString}` : url;
  };

  const cacheKey = generateCacheKey(req.url, req.params);

  if (req.method === 'GET') {
    const cachedResponse = CACHE.get(cacheKey);
    if (cachedResponse) {
      return of(cachedResponse);
    }
  }

  busyService.busy();

  return next(req).pipe(
    delay(500),
    tap((response: HttpEvent<unknown>) => CACHE.set(cacheKey, response)),
    finalize(() => busyService.idle())
  );
};
