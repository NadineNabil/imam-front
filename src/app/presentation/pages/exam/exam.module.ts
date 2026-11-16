import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamRoutingModule } from './exam-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExamComponent } from './exam/exam.component';
import { ViolationPopupComponent } from 'src/app/shared/components/violation-popup/violation-popup.component';
import { FloatingCameraWidgetComponent } from 'src/app/shared/components/floating-camera-widget/floating-camera-widget.component';
import { RecoderComponent } from 'src/app/shared/components/recoder/recoder.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { TestWrapperComponent } from './test-wrapper/test-wrapper.component';
import { IdentityVerificationnComponent } from './identity-verificationn/identity-verificationn.component';


@NgModule({
  declarations: [ExamComponent, TestWrapperComponent,IdentityVerificationnComponent],
  imports: [
    CommonModule,
    ExamRoutingModule,
    SharedModule,
    ViolationPopupComponent,
    FloatingCameraWidgetComponent,
    RecoderComponent,
ConfirmDialogComponent  ]
})
export class ExamModule { }
