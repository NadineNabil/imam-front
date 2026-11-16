import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentityVerificationnComponent } from './identity-verificationn.component';

describe('IdentityVerificationnComponent', () => {
  let component: IdentityVerificationnComponent;
  let fixture: ComponentFixture<IdentityVerificationnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdentityVerificationnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IdentityVerificationnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
