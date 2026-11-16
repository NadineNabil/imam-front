import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentDirectoryManagementComponent } from './student-directory-management.component';
import { StudentDetailsComponent } from './student-details/student-details.component';

const routes: Routes = [
  {path:'',component:StudentDirectoryManagementComponent},
  {path:'student-details/:id',component:StudentDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentDirectoryManagementRoutingModule { }
