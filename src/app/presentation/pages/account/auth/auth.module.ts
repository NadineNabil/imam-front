import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthRoutingModule } from './auth-routing.module';
import { RecoverpwdComponent } from './recoverpwd/recoverpwd.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { LogoutComponent } from './logout/logout.component';
import { ConfirmmailComponent } from './confirmmail/confirmmail.component';
import { VerificationComponent } from './verification/verification.component';
import { OTPverificationComponent } from './otpverification/otpverification.component';
import { TwostepverificationComponent } from './twostepverification/twostepverification.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RecoverpwdComponent,
    LockscreenComponent,
    LogoutComponent,
    ConfirmmailComponent,
    VerificationComponent,
      OTPverificationComponent,
      TwostepverificationComponent,
      ResetpasswordComponent
  ],
  imports: [
    TranslateModule,
    CommonModule,
    AuthRoutingModule,
    CarouselModule,
    ReactiveFormsModule,
    FormsModule,
    NgOtpInputModule,
    NgbCarouselModule
  ]
})
export class AuthModule { }

