import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamDetailsRoutingModule } from './exam-details-routing.module';
import { NgbDatepickerModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ExamDetailsComponent } from './exam-details/exam-details.component';
import { SharedModule } from "src/app/shared/shared.module";
import { AssessmentSettingsComponent } from './assessment-settings/assessment-settings.component';
import { PracticeSetttingsComponent } from './practice-setttings/practice-setttings.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { QuestionsWrapperComponent } from './questions-wrapper/questions-wrapper.component';
import { ScheduleExamComponent } from './schedule-exam/schedule-exam.component';
import { FlatpickrModule } from 'angularx-flatpickr';


@NgModule({
  declarations: [ExamDetailsComponent, AssessmentSettingsComponent,PracticeSetttingsComponent,QuestionsWrapperComponent,ScheduleExamComponent],
  imports: [
    CommonModule,
    ExamDetailsRoutingModule,
    NgbNavModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    FlatpickrModule.forRoot()
]
})
export class ExamDetailsModule { }
