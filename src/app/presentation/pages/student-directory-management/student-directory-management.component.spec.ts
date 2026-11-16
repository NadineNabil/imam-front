import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDirectoryManagementComponent } from './student-directory-management.component';

describe('StudentDirectoryManagementComponent', () => {
  let component: StudentDirectoryManagementComponent;
  let fixture: ComponentFixture<StudentDirectoryManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDirectoryManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentDirectoryManagementComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
