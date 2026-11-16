import { ToastService } from 'src/app/shared/services/toast-service';
import { Injectable, Inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, EMPTY } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IAuthRepository, AUTH_REPOSITORY_TOKEN } from '../../domain/repository-contracts/auth-repository.contract';
import { AuthStateService } from 'src/app/shared/services';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private readonly refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly toastService: ToastService,
    @Inject(AUTH_REPOSITORY_TOKEN) private readonly authRepository: IAuthRepository,
    private readonly authState: AuthStateService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
          // No internet connection / network error
  if (error.status === 0) {
    const msg = this.translate.instant('AUTH_ERRORS.NO_INTERNET_CONNECTION');
    return throwError(() => msg);
  }
        if (error.status === 401 && this.isLoginUrl(request.url)) {
          const msg = this.translate.instant('AUTH_ERRORS.INVALID_CREDENTIALS');
          return throwError(() => new Error(msg));
        }
        if (error.status === 401 && !this.isRefreshUrl(request.url)) {
          return this.handle401Error(request, next);
        }
        const errorMessage = this.extractErrorMessage(error);
        return throwError(() =>errorMessage);
      })
    );
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      if (this.authState.isRefreshTokenExpired || !this.authState.refreshTokenValue) {
        this.isRefreshing = false;
        this.forceLogout();
        return throwError(() => new Error(this.translate.instant('AUTH_ERRORS.SESSION_EXPIRED')));
      }

      return this.authRepository.refreshToken().pipe(
          catchError(err => {
    this.isRefreshing = false;
    this.forceLogout();
    return throwError(() => new Error(
      this.translate.instant('AUTH_ERRORS.SESSION_EXPIRED')
    ));
  }),
        switchMap(user => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(user.token!);
          return next.handle(this.addToken(request, user.token!)).pipe(
            catchError(err => {
              const msg=this.extractErrorMessage(err);
              this.toastService.showError(msg);
              return throwError(() => err);

            })
          );

        }),
      );
    }

    // Another request hit 401 while we're already refreshing — queue it
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next.handle(this.addToken(request, token!)))
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  private forceLogout(): void {
    this.authState.clearTokens();
    this.router.navigate(['/account/login']);
  }

  private isLoginUrl(url: string): boolean {
    return url.includes('/auth/login');
  }

  /**
   * Prevents infinite loop: don't try to refresh when the refresh call itself fails.
   */
  private isRefreshUrl(url: string): boolean {
    return url.includes('/auth/refresh');
  }

  private extractErrorMessage(error: HttpErrorResponse): string {
    if (error.error?.message) {
      return error.error.message;
    }
    if (error.error?.detail) {
      return error.error.detail;
    }
      if (error.error?.error) {
    return error.error;
  }
    return error.statusText || 'An unexpected error occurred';
  }
}
