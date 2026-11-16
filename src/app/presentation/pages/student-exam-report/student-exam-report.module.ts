import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FeatherModule } from 'angular-feather';
import { StudentExamReportRoutingModule } from './student-exam-report-routing.module';
import { StudentExamReportComponent } from './student-exam-report.component';

@NgModule({
  declarations: [StudentExamReportComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FeatherModule,
    StudentExamReportRoutingModule
  ]
})
export class StudentExamReportModule {}
