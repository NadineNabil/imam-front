import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewProfileStudentComponent } from './view-profile-student/view-profile-student.component';
import { EditProfileStudentComponent } from './edit-profile-student/edit-profile-student.component';
import { EditProfileGuard } from '../../guards/edit-profile.guard';

const routes: Routes = [{path: '', component: ViewProfileStudentComponent},
  {path:'edit-profile-student',component: EditProfileStudentComponent,canActivate: [EditProfileGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileStudentRoutingModule { }
