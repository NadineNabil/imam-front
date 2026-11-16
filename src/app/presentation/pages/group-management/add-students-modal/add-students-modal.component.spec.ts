import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStudentsModalComponent } from './add-students-modal.component';

describe('AddStudentsModalComponent', () => {
  let component: AddStudentsModalComponent;
  let fixture: ComponentFixture<AddStudentsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStudentsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStudentsModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
