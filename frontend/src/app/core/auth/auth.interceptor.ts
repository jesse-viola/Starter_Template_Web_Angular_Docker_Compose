import { inject, signal } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
} from '@angular/common/http';
import { catchError, switchMap, finalize } from 'rxjs/operators';
import { throwError, EMPTY, Observable } from 'rxjs';
import { AuthService } from './auth.service';

// Global state for token refresh management
const isRefreshing = signal(false);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Don't add token to auth endpoints
  if (isAuthEndpoint(req.url)) {
    return next(req);
  }

  // Add auth token to request
  const authReq = addAuthToken(req, authService);

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 errors with token refresh
      if (error.status === 401 && !isAuthEndpoint(req.url)) {
        return handle401Error(authReq, next, authService);
      }

      // For other errors, just pass them through
      return throwError(() => error);
    })
  );
};

/**
 * Add authentication token to request headers
 */
function addAuthToken(req: HttpRequest<unknown>, authService: AuthService): HttpRequest<unknown> {
  const token = authService.getAccessToken();

  if (token) {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return req;
}

/**
 * Handle 401 unauthorized errors with token refresh
 */
function handle401Error(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing()) {
    isRefreshing.set(true);

    return authService.refreshToken().pipe(
      switchMap(() => {
        isRefreshing.set(false);
        // Retry the original request with new token
        const authReq = addAuthToken(req, authService);
        return next(authReq) as Observable<HttpEvent<unknown>>;
      }),
      catchError(error => {
        isRefreshing.set(false);
        // If refresh fails, logout user
        authService.logout().subscribe();
        return throwError(() => error) as Observable<HttpEvent<unknown>>;
      }),
      finalize(() => {
        isRefreshing.set(false);
      })
    );
  } else {
    // If refresh is already in progress, just return empty to avoid duplicate requests
    return EMPTY as Observable<HttpEvent<unknown>>;
  }
}

/**
 * Check if the request is to an authentication endpoint
 */
function isAuthEndpoint(url: string): boolean {
  const authEndpoints = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/refresh',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
  ];

  return authEndpoints.some(endpoint => url.includes(endpoint));
}
