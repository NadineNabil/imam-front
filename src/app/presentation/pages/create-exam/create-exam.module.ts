import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateExamRoutingModule } from './create-exam-routing.module';
import { CreateExamComponent } from './create-exam/create-exam.component';
import { ExamBasicInfoComponent } from './exam-basic-info/exam-basic-info.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExamObjectivesComponent } from './exam-objectives/exam-objectives.component';
import { QuestionTypesComponent } from './question-types/question-types.component';
import { ResponseTypesComponent } from './response-types/response-types.component';
import { CountUpDirective } from "ngx-countup";
import { XlsxQuestionUploadComponent } from "./xlsx-question-upload/xlsx-question-upload.component";
import { TrimInputDirective } from "src/app/presentation/directives/trimInput";
import { SourceRatioStepComponent } from './source-ratio-step/source-ratio-step.component';


@NgModule({
  declarations: [
    CreateExamComponent,
    ExamBasicInfoComponent,
    ExamObjectivesComponent
    ,QuestionTypesComponent,
    ResponseTypesComponent,
    XlsxQuestionUploadComponent,
    SourceRatioStepComponent
  ],
  imports: [
    CommonModule,
    CreateExamRoutingModule,
    NgSelectModule,
    ReactiveFormsModule,
    CdkStepperModule,
    NgStepperModule,
    SharedModule,
    CountUpDirective,
    TrimInputDirective
]
})
export class CreateExamModule { }
