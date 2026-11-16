import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { checkOtpGuard } from './check-otp.guard';

describe('checkOtpGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => checkOtpGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
