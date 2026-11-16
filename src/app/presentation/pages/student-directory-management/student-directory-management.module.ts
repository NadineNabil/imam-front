import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentDirectoryManagementRoutingModule } from './student-directory-management-routing.module';
import { StudentDirectoryManagementComponent } from './student-directory-management.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { StudentDetailsComponent } from './student-details/student-details.component';


@NgModule({
  declarations: [StudentDirectoryManagementComponent,StudentDetailsComponent],
  imports: [
    CommonModule,
    StudentDirectoryManagementRoutingModule,
    SharedModule
  ]
})
export class StudentDirectoryManagementModule { }
