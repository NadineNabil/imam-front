import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainingRoutingModule } from './training-routing.module';
import { TrainingComponent } from './training.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecoderComponent } from 'src/app/shared/components/recoder/recoder.component';


@NgModule({
  declarations: [TrainingComponent],
  imports: [
    CommonModule,
    TrainingRoutingModule,
    SharedModule,
    RecoderComponent
  ]
})
export class TrainingModule { }
