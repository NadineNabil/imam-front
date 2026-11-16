import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsWrapperComponent } from './questions-wrapper.component';

describe('QuestionsWrapperComponent', () => {
  let component: QuestionsWrapperComponent;
  let fixture: ComponentFixture<QuestionsWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionsWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionsWrapperComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
