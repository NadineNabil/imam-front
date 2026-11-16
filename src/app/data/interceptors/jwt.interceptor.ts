import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthStateService } from 'src/app/shared/services';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private readonly authState: AuthStateService,
    private readonly cookieService: CookieService,
    private readonly translate: TranslateService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const cookieLang = this.cookieService.check('lang')
      ? this.cookieService.get('lang')
      : null;
    const lang =
      this.translate.currentLang ||
      cookieLang ||
      this.translate.getBrowserLang() ||
      'en';

    const headers: Record<string, string> = { 'Accept-Language': lang };

    const token = this.authState.accessToken;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    request = request.clone({ setHeaders: headers });
    return next.handle(request);
  }
}
