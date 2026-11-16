import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XlsxQuestionUploadComponent } from './xlsx-question-upload.component';

describe('XlsxQuestionUploadComponent', () => {
  let component: XlsxQuestionUploadComponent;
  let fixture: ComponentFixture<XlsxQuestionUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XlsxQuestionUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XlsxQuestionUploadComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
