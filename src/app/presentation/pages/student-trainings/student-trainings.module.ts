import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';


import { FeatherModule } from 'angular-feather';
import { FlatpickrDirective, provideFlatpickrDefaults } from 'angularx-flatpickr';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { StudentTrainingsRoutingModule } from './student-trainings-routing.module';
import { StudentTrainingsComponent } from './student-trainings.component';
import { TrainingDetailComponent } from './training-detail/training-detail.component';

@NgModule({
  declarations: [StudentTrainingsComponent, TrainingDetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule,
    FlatpickrDirective,
    NgbDropdownModule,
     FeatherModule,
    StudentTrainingsRoutingModule
  ],
  providers: [
    provideFlatpickrDefaults()
  ]
})
export class StudentTrainingsModule {}
