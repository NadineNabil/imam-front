import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestWrapperComponent } from './test-wrapper/test-wrapper.component';
import { ExamComponent } from './exam/exam.component';
const routes: Routes = [
   {
    path: ':id',
    component: TestWrapperComponent,
    children: [
      {
        path: '',
        component: ExamComponent
      }
    ]
  }, 
 
/*       {
        path: ':id',
        component: ExamComponent
      } */

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamRoutingModule { }
