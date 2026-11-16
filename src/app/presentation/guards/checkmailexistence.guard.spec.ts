import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { checkmailexistenceGuard } from './checkmailexistence.guard';

describe('checkmailexistenceGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => checkmailexistenceGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
