import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCoursesModalComponent } from './all-courses-modal.component';

describe('AllCoursesModalComponent', () => {
  let component: AllCoursesModalComponent;
  let fixture: ComponentFixture<AllCoursesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllCoursesModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCoursesModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
