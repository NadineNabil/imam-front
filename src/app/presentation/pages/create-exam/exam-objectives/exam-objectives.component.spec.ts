import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamObjectivesComponent } from './exam-objectives.component';

describe('ExamObjectivesComponent', () => {
  let component: ExamObjectivesComponent;
  let fixture: ComponentFixture<ExamObjectivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamObjectivesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamObjectivesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
