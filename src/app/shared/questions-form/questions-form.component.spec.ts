import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsFormComponent } from './questions-form.component';

describe('QuestionsFormComponent', () => {
  let component: QuestionsFormComponent;
  let fixture: ComponentFixture<QuestionsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionsFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
