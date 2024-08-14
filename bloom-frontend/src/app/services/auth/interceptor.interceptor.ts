import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Inject, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';


export const Interceptor: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const router = inject(Router);
  let token;

  let platform_id = inject(PLATFORM_ID);

  if(isPlatformBrowser(platform_id)) {
    token = localStorage.getItem('token');
  }
  if (token) {
    request = request.clone({
      setHeaders: { Authorization: `Token ${token}` }
    });
  }

  return next(request).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          if(isPlatformBrowser(platform_id)){
          localStorage.removeItem('token');
          }
          router.navigate(['/signin']);
        }
      }
      return throwError(() => err);
    })
  );
};
