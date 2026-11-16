import { Injectable, Inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthStateService } from '../../shared/services/auth-state.service';

/**
 * Auth Guard
 * 
 * Depends on AuthStateService (shared layer) for authentication checks.
 * This follows Clean Architecture - presentation depends on shared services, not the data layer.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(
    private readonly router: Router,
    private readonly authState: AuthStateService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authState.isAuthenticated) {
      return true;
    }

    // Not logged in, redirect to login with return URL
    this.router.navigate(['/account/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
}

