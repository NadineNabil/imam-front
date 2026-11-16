import { Component, effect, Input, OnChanges, OnInit, Signal, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { startWith } from 'rxjs';
import { ObjectivesState } from 'src/app/presentation/models/objective-ui.model';

@Component({
  selector: 'app-source-ratio-step',
  templateUrl: './source-ratio-step.component.html',
  styleUrl: './source-ratio-step.component.scss',
  standalone: false,
})
export class SourceRatioStepComponent  implements OnInit{
   loading:boolean=false

ngOnInit(): void {
  const objectives = this.examForm.get('objectives') as FormArray;

  objectives.valueChanges
    .pipe(startWith(objectives.value))
    .subscribe(values => {
      this.loading = values.length === 0;
    });
}



 
  @Input() examForm!: FormGroup;
totalQuestions = 10;

  get aiQuestionRatio(): number {
    return Number(this.examForm?.get('aiQuestionRatio')?.value ?? 0);
  }

  get sourceMaterialRatio(): number {
    return Number(this.examForm?.get('sourceMaterialRatio')?.value ?? 0);
  }
 get hasKnowledgeSource(): boolean {
  return this.examForm.get('hasKnoledgeSource')?.value;
}

  get progressPercent(): number {
    return this.aiQuestionRatio;
  }

  syncRatioValues(controlName: 'aiQuestionRatio' | 'sourceMaterialRatio', value: number): void {
    if (!this.examForm) {
      return;
    }

    const nextValue = this.clamp(Math.round(Number(value) || 0), 0, 100);
    const otherControlName: 'aiQuestionRatio' | 'sourceMaterialRatio' =
      controlName === 'aiQuestionRatio' ? 'sourceMaterialRatio' : 'aiQuestionRatio';

    this.examForm.patchValue({
      [controlName]: nextValue,
      [otherControlName]: Math.max(0, 100 - nextValue),
    }, { emitEvent: false });
  }

  onRatioInput(controlName: 'aiQuestionRatio' | 'sourceMaterialRatio', value: string | number): void {
    this.syncRatioValues(controlName, Number(value));
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }
  get aiQuestions(): number {
  return Math.round((this.aiQuestionRatio / 100) * this.totalQuestions);
}

get sourceQuestions(): number {
  return this.totalQuestions - this.aiQuestions;
}

}
