import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'src/app/shared/shared.module';
import { ViewExamsComponent } from './view-exams.component';

const VIEW_EXAMS_ROUTES: Routes = [
  { path: '', component: ViewExamsComponent }
];

@NgModule({
  declarations: [ViewExamsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(VIEW_EXAMS_ROUTES),
  ],
})
export class ViewExamsModule {}

