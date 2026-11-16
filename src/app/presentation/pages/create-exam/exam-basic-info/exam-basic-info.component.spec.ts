import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamBasicInfoComponent } from './exam-basic-info.component';

describe('ExamBasicInfoComponent', () => {
  let component: ExamBasicInfoComponent;
  let fixture: ComponentFixture<ExamBasicInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamBasicInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamBasicInfoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
