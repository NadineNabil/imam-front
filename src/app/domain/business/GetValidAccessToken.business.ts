import { Injectable, Inject } from "@angular/core";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { AuthRepositoryImpl } from "src/app/data/repositories";
import { AuthStateService } from "src/app/shared/services";

@Injectable({ providedIn: 'root' })
export class GetValidAccessTokenUseCase {
  constructor(private authRepo: AuthRepositoryImpl,
              private authState: AuthStateService) {}

              /*
              IF no token → return null  
IF token valid → return current token  
IF token expired → refresh it → return NEW token  
IF refresh expired → logout → return null  */

  execute(): Observable<string | null> {

    if (!this.authState.accessToken) {
      return of(null);
    }

    if (!this.authState.isAccessTokenExpired) {
      return of(this.authState.accessToken);
    }

    if (this.authState.isRefreshTokenExpired) {
      this.authState.clearTokens();
      return of(null);
    }

    return this.authRepo.refreshToken().pipe(
      map(() => this.authState.accessToken),
      catchError(() => {
        this.authState.clearTokens();
        return of(null);
      })
    );
  }
}