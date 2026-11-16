import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentExamReportComponent } from './student-exam-report.component';

const routes: Routes = [
  {
    path: '',
    component: StudentExamReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentExamReportRoutingModule {}
