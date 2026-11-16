import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { learningUnitsRoutingModule } from './learningUnits-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddlearningUnitComponent } from './add-learningUnit/add-learningUnit.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { DropzoneModule, DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { TranslateModule } from '@ngx-translate/core';
import { EditlearningUnitComponent } from './edit-learningUnit/edit-learningUnit.component';
import { ViewLearningUnitsComponent } from './view-learningUnits/view-learningUnits.component';
import { AddStudentModalComponent } from './add-student-modal/add-student-modal.component';

const DEFAULT_DROPZONE_CONFIG = {};

@NgModule({
  declarations: [
    ViewLearningUnitsComponent,
    AddlearningUnitComponent,
    EditlearningUnitComponent,

    AddStudentModalComponent
    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    learningUnitsRoutingModule,
    TranslateModule,
    CdkStepperModule,
    NgStepperModule,
    DropzoneModule,
    
    SharedModule,
  ],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    },
    SharedModule,
    
  ]
})
export class LearningUnitsModule { }
