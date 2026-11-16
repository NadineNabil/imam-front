import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamDetailsComponent } from './exam-details/exam-details.component';
import { unsavedChangesGuard } from '../../guards/unsaved-changes.guard';

const routes: Routes = [{ path: '', component: ExamDetailsComponent, canDeactivate: [unsavedChangesGuard] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamDetailsRoutingModule { }
