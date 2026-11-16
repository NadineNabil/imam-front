import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileStudentRoutingModule } from './profile-student-routing.module';
import { ViewProfileStudentComponent } from './view-profile-student/view-profile-student.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditProfileStudentComponent } from './edit-profile-student/edit-profile-student.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CountUpDirective } from "ngx-countup";
import { NgbModalModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    ViewProfileStudentComponent,
    EditProfileStudentComponent],
  imports: [
    CommonModule,
    ProfileStudentRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    CountUpDirective,
    NgbNavModule,
    
]
})
export class ProfileStudentModule { }
