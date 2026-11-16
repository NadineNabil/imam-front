import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionTypesComponent } from './question-types.component';

describe('QuestionTypesComponent', () => {
  let component: QuestionTypesComponent;
  let fixture: ComponentFixture<QuestionTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionTypesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
