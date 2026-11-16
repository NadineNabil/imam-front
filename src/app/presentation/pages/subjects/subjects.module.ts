import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddSubjectComponent } from './add-subject/add-subject.component';
import { RouterModule } from '@angular/router';
import { SUBJECT_ROUTES } from './subjects.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { WidgetModule } from "src/app/shared/widget/widget.module";
import { SharedModule } from "src/app/shared/shared.module";
import { AllSubjectsComponent } from './all-subjects/all-subjects.component';



@NgModule({
  declarations: [
    AddSubjectComponent,
    AllSubjectsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(SUBJECT_ROUTES),
    ReactiveFormsModule, 
    SharedModule,
]
})
export class SubjectsModule { }
