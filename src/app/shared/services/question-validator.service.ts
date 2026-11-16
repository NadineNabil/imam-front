// question-validator.service.ts

import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, ValidationErrors, Validators } from '@angular/forms';
import { QuestionTypeEnum } from 'src/app/domain/enums/question-type.enum';

@Injectable({ providedIn: 'root' })
export class QuestionValidatorService {

  questionValidator(control: AbstractControl): ValidationErrors | null {
  const type = control.get('type')?.value as QuestionTypeEnum;
  const options = control.get('options') as FormArray;
  const correctAnswer = control.get('correctAnswer');

  if (!type) return null;

  const selectedCount =
    options?.controls?.filter(c => c.get('isCorrect')?.value === true).length || 0;

  if (type === QuestionTypeEnum.multiple_choice || type === QuestionTypeEnum.true_false) {
    if (selectedCount !== 1) {
      return { invalidCorrectSelection: true };
    }
  }

/*   if (type === QuestionTypeEnum.multiple_response) {
    if (selectedCount < 1) {
      return { invalidCorrectSelection: true };
    }
  } */

  if (!['single_choice', 'multiple_choice', 'true_false', 'multiple_response'].includes(type)) {
    if (!correctAnswer?.value) {
      return { correctAnswerRequired: true };
    }
  }

  return null;
}

}
