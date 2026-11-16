import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationPopupComponent } from './violation-popup.component';

describe('ViolationPopupComponent', () => {
  let component: ViolationPopupComponent;
  let fixture: ComponentFixture<ViolationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViolationPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViolationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
