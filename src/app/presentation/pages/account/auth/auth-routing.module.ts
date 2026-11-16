import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecoverpwdComponent } from './recoverpwd/recoverpwd.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { LogoutComponent } from './logout/logout.component';
import { ConfirmmailComponent } from './confirmmail/confirmmail.component';
import { VerificationComponent } from './verification/verification.component';
import { OTPverificationComponent } from './otpverification/otpverification.component';
import { TwostepverificationComponent } from './twostepverification/twostepverification.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { checkmailexistenceGuard } from 'src/app/presentation/guards/checkmailexistence.guard';
import { checkOtpGuard } from 'src/app/presentation/guards/check-otp.guard';
const routes: Routes = [
  {
    path: 'recoverpw',
    component: RecoverpwdComponent,
  },
  {
    path: 'lock-screen',
    component: LockscreenComponent,
  },
  {
    path: 'logout',
    component: LogoutComponent,
  },
  {
    path: 'confirm-mail',
    component: ConfirmmailComponent,
  },
  {
    path: 'email-verification',
    component: VerificationComponent,
  },
  {
    path: 'two-step-verification',
    component: TwostepverificationComponent,
  },
  {
    path: 'otp-verification',
    component: OTPverificationComponent,
    canActivate: [checkmailexistenceGuard]
  },
  {
    path: 'reset-password',
    component: ResetpasswordComponent,
    canActivate: [checkmailexistenceGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }

