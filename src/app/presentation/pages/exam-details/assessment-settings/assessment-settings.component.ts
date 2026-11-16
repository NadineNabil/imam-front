import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { QuestionVM } from 'src/app/presentation/models/questions-ui-model';
import { ToastService } from 'src/app/shared/services/toast-service';

@Component({
  selector: 'app-assessment-settings',
  templateUrl: './assessment-settings.component.html',
  styleUrl: './assessment-settings.component.scss',
  standalone: false
})
export class AssessmentSettingsComponent {
@Input() assessmentForm!: FormGroup;
@Input() hideAssesmentTitle:boolean=false;
@Input()trainingControlsTitle:string='EXAMS.EXAM_BEHAVIOR_CONTROLS';
@Input() questions: QuestionVM[] = [];
@Output() timerToggle = new EventEmitter<'total' | 'perQuestion'>();
@Output() saveDisabled = new EventEmitter<boolean>();
hour:number = 2;
minute:number = 30;
minutePerQuestion:number = 1;
settings = [
  {
    title: 'EXAMS.DISABLE_COPY',
    description: 'EXAMS.DISABLE_COPY_DESC',
    controlName: 'disableCopy' //later will add control name to be in examform form group
  },
  {
    title: 'EXAMS.RANDOMIZE_QUESTION_ORDER',
    description: 'EXAMS.RANDOMIZE_QUESTION_ORDER_DESC',
    controlName: 'randomizeQuestionOrder'//later will add control name to be in examform form group
  },
  {
    title: 'EXAMS.RANDOMIZE_ANSWER_CHOICES',
    description: 'EXAMS.RANDOMIZE_ANSWER_CHOICES_DESC',
    controlName: 'randomizeAnswerChoices'//later will add control name to be in examform form group
  },
  {
    title: 'EXAMS.ENABLE_SPELL_CHECK',
    description: 'EXAMS.ENABLE_SPELL_CHECK_DESC',
    controlName: 'enableSpellCheck'//later will add control name to be in examform form group
  },
  {
    title: 'EXAMS.ALLOW_BACKWARD_NAVIGATION',
    description: 'EXAMS.ALLOW_BACKWARD_NAVIGATION_DESC',
    controlName: 'allowBackwardNavigation'//later will add control name to be in examform form group
  },
  {
    title: 'EXAMS.MISSING_ANSWER_REMINDER',
    description: 'EXAMS.MISSING_ANSWER_REMINDER_DESC',
    controlName: 'missingAnswerReminder'//later will add control name to be in examform form group
  }
];

constructor(private toastr:ToastService,private translate: TranslateService) { }
/*   ngOnChanges(changes: SimpleChanges): void {
    if (changes['assessmentForm'].firstChange && this.assessmentForm) {
      if(this.assessmentForm.get('totalHours')?.value > 0 || this.assessmentForm.get('totalMinutes')?.value > 0) {
        this.toggleTimer('total');
      } else if(this.assessmentForm.get('perQuestionMinutes')?.value > 0) {
        this.toggleTimer('perQuestion');
      }
  }
} */
incrementHour() {
  const current = this.assessmentForm.get('totalHours')?.value ?? 0;
  this.assessmentForm.patchValue({ totalHours: current + 1 });
//this.checkPerQuestionTime();
}

decrementHour() {
  const current = this.assessmentForm.get('totalHours')?.value ?? 0;
  if (current > 0) this.assessmentForm.patchValue({ totalHours: current - 1 });
   //this.checkPerQuestionTime();
}
incrementMinute() {
  let currentMinute = this.assessmentForm.get('totalMinutes')?.value ?? 0;
  let currentHour = this.assessmentForm.get('totalHours')?.value ?? 0;
  if (currentMinute < 59) {
    currentMinute++;
  } else {
    currentMinute = 0;
    currentHour++;
  }
  this.assessmentForm.patchValue({ totalMinutes: currentMinute, totalHours: currentHour });
  //this.checkPerQuestionTime();
}
decrementMinute() {
  let currentMinute = this.assessmentForm.get('totalMinutes')?.value ?? 0;
  let currentHour = this.assessmentForm.get('totalHours')?.value ?? 0;
  if (currentMinute > 0) {
    currentMinute--;
  } else if (currentHour > 0) {
    currentMinute = 59;
    currentHour--;
  }
  this.assessmentForm.patchValue({ totalMinutes: currentMinute, totalHours: currentHour });
  //this.checkPerQuestionTime();
}
incrementMinutePerQuestion() {
/*   const totalMinutes = (this.assessmentForm.get('totalMinutes')?.value ?? 0) +
                       (this.assessmentForm.get('totalHours')?.value ?? 0) * 60; */
  const currentPerQuestion = this.assessmentForm.get('perQuestionMinutes')?.value ?? 0;
/*     const questionsNumber=this.questions.length
 */    this.assessmentForm.patchValue({ perQuestionMinutes: currentPerQuestion + 1 });

/*   if ((currentPerQuestion+ 1)*questionsNumber<=totalMinutes) {
    this.assessmentForm.patchValue({ perQuestionMinutes: currentPerQuestion + 1 });
  } else {
    this.toastr.showError(
      this.translate.instant('EXAMS.MINUTE_PER_QUESTION_CANNOT_EXCEED_TOTAL_EXAM_TIME')
    );
  } */
  //this.checkPerQuestionTime();
}
decrementMinutePerQuestion() {
  const currentPerQuestion = this.assessmentForm.get('perQuestionMinutes')?.value ?? 0;
  if (currentPerQuestion > 0) {
    this.assessmentForm.patchValue({ perQuestionMinutes: currentPerQuestion - 1 });
      //this.checkPerQuestionTime();

  }
}
get formattedHour(): string {
  return (this.assessmentForm.get('totalHours')?.value ?? 0).toString().padStart(2, '0');
}

get formattedMinute(): string {
  return (this.assessmentForm.get('totalMinutes')?.value ?? 0).toString().padStart(2, '0');
}

get formattedQuestionPerMinute(): string {
  return (this.assessmentForm.get('perQuestionMinutes')?.value ?? 0).toString().padStart(2, '0');
}
//to prevent user from entering minutes more than the total minutes of exam time
//to prevent user from saving ,when total minutes per question more than the total time
/* checkPerQuestionTime() {
  const totalMinutes = (this.assessmentForm.get('totalMinutes')?.value ?? 0) +
                       (this.assessmentForm.get('totalHours')?.value ?? 0) * 60;
  const perQuestion = this.assessmentForm.get('perQuestionMinutes')?.value ?? 0;
  const questionsCount = this.questions.length;
  if (perQuestion * questionsCount > totalMinutes) {
    this.saveDisabled.emit(true);  
    // Show translated toastr error
    this.toastr.showError(
      this.translate.instant('EXAMS.MINUTE_PER_QUESTION_CANNOT_EXCEED_TOTAL_EXAM_TIME')
    );  } else {
    this.saveDisabled.emit(false); 
  }
} */
onTimerToggle(selected: 'total' | 'perQuestion') {
  this.timerToggle.emit(selected);
}
get isTotalActive(): boolean {
  return this.assessmentForm.get('totalQuestionTimerActive')?.value;
}

get isPerQuestionActive(): boolean {
  return this.assessmentForm.get('perQuestionTimerActive')?.value;
}
}