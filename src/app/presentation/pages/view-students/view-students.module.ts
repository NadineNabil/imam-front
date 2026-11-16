import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewStudentsComponent } from './view-students.component';
import { viewStudentsRoutingModule } from './view-students-routes';

@NgModule({
  declarations: [
   ViewStudentsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    viewStudentsRoutingModule
  ],
})
export class ViewStudentsModule { }
