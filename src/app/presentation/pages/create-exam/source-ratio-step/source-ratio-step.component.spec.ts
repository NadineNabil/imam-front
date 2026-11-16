import { FormBuilder, FormGroup } from '@angular/forms';

import { SourceRatioStepComponent } from './source-ratio-step.component';

describe('SourceRatioStepComponent', () => {
  let component: SourceRatioStepComponent;
  let form: FormGroup;

  beforeEach(() => {
    component = new SourceRatioStepComponent();
    form = new FormBuilder().group({
      aiQuestionRatio: [0],
      sourceMaterialRatio: [0],
    });
    component.examForm = form;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keep the total ratio at 100% when one value changes', () => {
    component.onRatioInput('aiQuestionRatio', '50');

    expect(form.get('aiQuestionRatio')?.value).toBe(50);
    expect(form.get('sourceMaterialRatio')?.value).toBe(50);

    component.onRatioInput('sourceMaterialRatio', '60');

    expect(form.get('aiQuestionRatio')?.value).toBe(40);
    expect(form.get('sourceMaterialRatio')?.value).toBe(60);
  });
});
