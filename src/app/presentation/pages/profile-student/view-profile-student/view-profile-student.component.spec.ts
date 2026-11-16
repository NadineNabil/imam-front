import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProfileStudentComponent } from './view-profile-student.component';

describe('ViewProfileStudentComponent', () => {
  let component: ViewProfileStudentComponent;
  let fixture: ComponentFixture<ViewProfileStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewProfileStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewProfileStudentComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
