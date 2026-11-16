import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FeatherModule } from 'angular-feather';
import { FlatpickrDirective, provideFlatpickrDefaults } from 'angularx-flatpickr';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { StudentAssessmentsRoutingModule } from './student-assessments-routing.module';
import { StudentAssessmentsComponent } from './student-assessments.component';

@NgModule({
  declarations: [StudentAssessmentsComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule,
    FeatherModule,
    FlatpickrDirective,
    NgbDropdownModule,
    StudentAssessmentsRoutingModule
  ],
  providers: [
    provideFlatpickrDefaults()
  ]
})
export class StudentAssessmentsModule {}
