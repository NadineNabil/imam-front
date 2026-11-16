import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AUTH_BUSINESS_TOKEN, IAuthBusiness } from 'src/app/domain/business-contracts/auth-business.contract';

/**
 * Role Redirect Guard
 *
 * Redirects users from the empty root path based on their role:
 * - Students  → /student-dashboard
 * - All other authenticated users (admin, etc.) → /tree
 */
export const roleRedirectGuard: CanActivateFn = (_route, _state) => {
  const router = inject(Router);
  const authBusiness = inject<IAuthBusiness>(AUTH_BUSINESS_TOKEN);

  const roles: string[] = authBusiness.getCurrentUser()?.roles ?? [];

  if (roles.includes('student')) {
    return router.createUrlTree(['/student-dashboard']);
  }

  // Default for admin / teacher / any other role
  return true
};
