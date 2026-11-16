import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationexpireComponent } from './invitationexpire.component';

describe('InvitationexpireComponent', () => {
  let component: InvitationexpireComponent;
  let fixture: ComponentFixture<InvitationexpireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitationexpireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitationexpireComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
