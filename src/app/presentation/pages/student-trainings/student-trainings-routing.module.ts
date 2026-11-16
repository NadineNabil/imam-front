import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentTrainingsComponent } from './student-trainings.component';
import { TrainingDetailComponent } from './training-detail/training-detail.component';

const routes: Routes = [
  {
    path: '',
    component: StudentTrainingsComponent
  },
  {
    path: ':id',
    component: TrainingDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentTrainingsRoutingModule { }
