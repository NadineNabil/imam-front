import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamReportComponent } from './exam-report.component';

describe('ExamReportComponent', () => {
  let component: ExamReportComponent;
  let fixture: ComponentFixture<ExamReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamReportComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
