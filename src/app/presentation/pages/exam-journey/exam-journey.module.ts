import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'src/app/shared/shared.module';
import { ExamJourneyComponent } from './exam-journey.component';
import { ExamReportComponent } from '../exam-report/exam-report.component';
import { TopbarComponent } from '../../layouts/topbar/topbar.component';
import { LayoutsModule } from '../../layouts/layouts.module';
import { FeatherModule } from "angular-feather";

const routes: Routes = [
  {
    path: '',
    component: ExamJourneyComponent
  }
];

@NgModule({
  declarations: [ExamJourneyComponent,ExamReportComponent],
  imports: [CommonModule, SharedModule, LayoutsModule, RouterModule.forChild(routes), FeatherModule]
})
export class ExamJourneyModule {}
