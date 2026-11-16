import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const checkOtpGuard: CanActivateFn = () => {
  const router = inject(Router);

  const email = localStorage.getItem('email');
  const successOtp = localStorage.getItem('successOtp');

  if (!email) {
    return router.createUrlTree(['/account/auth/reset-password']);
  }

  if (!successOtp) {
    return router.createUrlTree(['/account/auth/otp-verification']);
  }

  return true;
};