import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
  export function totalQuestionsNumber():ValidatorFn{
return (formArray:AbstractControl): ValidationErrors | null=>{
    if (!(formArray instanceof FormArray)) {
      return null;
    }
    const totalnumber=formArray.controls.reduce((total,control)=>{
      const questionsNumber=control.get('numberOfQuestions')?.value;
      return total+(Number(questionsNumber))

    },0)
    if(totalnumber>10){
             return { 
      totalQuestionNumberExceeded: true
     };
    }

    return null;
}

}
export function totalWeightValidator(isGenerated: boolean): ValidatorFn {
  return (formArray: AbstractControl): ValidationErrors | null => {
       if(!isGenerated)  return null;
    if (!(formArray instanceof FormArray)) {
      return null;
    }
    
    const totalweight = formArray.controls.filter(ctrl => ctrl.get('selected')?.value).reduce((total, control) => {
      const weight = control.get('weight')?.value;

      return total + (weight ? parseFloat(weight) : 0);
    }, 0);
    if (totalweight > 100) {
        console.log('Total weight exceeded:', totalweight);
      return { totalWeightExceeded: true };
    }
    return null;
  }
}
export function atLeastOneCheckedValidator(fieldName?: string): ValidatorFn {
  return (formArray: AbstractControl): ValidationErrors | null => {
    if (!(formArray instanceof FormArray)) return null;

    const isAnyChecked = formArray.controls.some(control => {
      if (fieldName && control instanceof FormGroup) {
        const value = control.get(fieldName)?.value;
        // For checkboxes, only true counts as selected
        return value === true;
      } else {
        return control.value === true;
      }
    });

    return isAnyChecked ? null : { atLeastOneChecked: true };
  };

}