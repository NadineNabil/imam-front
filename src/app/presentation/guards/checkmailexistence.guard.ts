import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const checkmailexistenceGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
const email = localStorage.getItem('email');
if (!email) {
  router.navigate(['/account/auth/recoverpw']);
  return false;
}
  return true;
};
